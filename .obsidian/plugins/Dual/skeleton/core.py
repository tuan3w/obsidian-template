from sentence_transformers import SentenceTransformer, CrossEncoder, util
import pickle
import os
import glob
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments, TextDataset, DataCollatorForLanguageModeling
from util import md_to_text
import json
import random
import re


class Core:
    def __init__(self, root_dir):
        self.root_dir = root_dir
        self.cache_address = os.path.join(root_dir, '.obsidian/plugins/Dual/skeleton/cache.pickle')
        self.entry_regex = os.path.join(root_dir, '**/*md')
        self.skeleton_ready = False
        self.essence_ready = False

        self.load_skeleton()
        self.load_essence()

        if os.path.isfile(self.cache_address) is False:
            self.create_cache()
        else:
            self.load_cache()
            self.sync_cache()

    def fluid_search(self, query, considered_candidates=50, selected_candidates=5, second_pass=True):
        self.load_essence()

        if self.essence_ready == False:
            return ['The essence is not present at the required location.']
        
        self.sync_cache()
        selected_candidates = min(selected_candidates, considered_candidates)
        query_embedding = self.text_encoder.encode(query, convert_to_tensor=True)
        hits = util.semantic_search(query_embedding, torch.Tensor(self.entry_embeddings), top_k=considered_candidates)[0]

        if second_pass:
            cross_scores = self.pair_encoder.predict([[query, self.entry_contents[hit['corpus_id']]] for hit in hits])

            for idx in range(len(cross_scores)):
                hits[idx]['cross-score'] = cross_scores[idx]

            hits = sorted(hits, key=lambda x: x['cross-score'], reverse=True)
            return [self.entry_filenames[hit['corpus_id']] for hit in hits[:selected_candidates] if hit['cross-score'] > 1e-3]
        else:
            return [self.entry_filenames[hit['corpus_id']] for hit in hits[:selected_candidates]]

    def descriptive_search(self, claim, polarity=True, target='premise', considered_candidates=50, selected_candidates=5):
        self.load_essence()

        if self.essence_ready == False:
            return ['The essence is not present at the required location.']

        selected_candidates = min(selected_candidates, considered_candidates)
        considered_candidates = min(considered_candidates, len(self.entry_filenames))     
        candidate_entry_filenames = self.fluid_search(claim, selected_candidates=considered_candidates, second_pass=False)
        candidate_entry_contents = [self.entries[e][0] for e in candidate_entry_filenames]

        if target == 'premise':
            cross_encoder_input = [(e, claim) for e in candidate_entry_contents]
        elif target == 'conclusion':
            cross_encoder_input = [(claim, e) for e in candidate_entry_contents]

        cross_encoder_output = self.nli.predict(cross_encoder_input, apply_softmax=False)
        
        if polarity == True:
            cross_encoder_output = [e[1] for e in cross_encoder_output]
        else:
            cross_encoder_output = [e[0] for e in cross_encoder_output]

        results = [(candidate_entry_filenames[idx], cross_encoder_output[idx]) for idx in range(considered_candidates)]
        results = sorted(results, key=lambda x: x[1], reverse=True)[:selected_candidates]
        results = [e[0] for e in results]

        return results

    def open_dialogue(self, question, considered_candidates=3):
        self.load_essence()

        if self.essence_ready == False:
            return ['The essence is not present at the required location.']

        candidate_entry_filenames = self.fluid_search(question, selected_candidates=considered_candidates)
        candidate_entry_contents = reversed([self.entries[e][0] for e in candidate_entry_filenames])
        generator_prompt = '\n\n'.join(candidate_entry_contents) + '\n\nQ: ' + question + '\nA: '
        input_ids = self.gen_tokenizer.encode(generator_prompt, return_tensors='pt')
        
        generator_output = self.gen_model.generate(
            input_ids, 
            do_sample=True, 
            max_length=len(input_ids[0]) + 100, 
            top_p=0.9, 
            top_k=40,
            temperature=0.9
        )

        output_sample = self.gen_tokenizer.decode(generator_output[0], skip_special_tokens=True)[len(generator_prompt):]
        output_sample = re.sub(r'^[\W_]+|[\W_]+$', '', output_sample)
        output_sample = re.sub(r'[^a-zA-Z0-9\s]{3,}', '', output_sample)
        output_sample = output_sample.split('Q:')[0].split('\n\n')[0].strip()
        output_sample += '...'
        
        return [output_sample]

    def load_skeleton(self):
        print('Loading skeleton...')
        self.text_encoder = SentenceTransformer('msmarco-distilbert-base-v2')
        self.pair_encoder = CrossEncoder('cross-encoder/ms-marco-TinyBERT-L-4')
        self.nli = CrossEncoder('cross-encoder/nli-distilroberta-base')
        self.skeleton_ready = True

    def load_essence(self):
        tentative_folder_path = os.path.join(self.root_dir, '.obsidian/plugins/Dual/essence')
        tentative_file_path = os.path.join(tentative_folder_path, 'pytorch_model.bin')

        if self.essence_ready == False and os.path.isfile(tentative_file_path):
            print('Loading essence...')
            self.gen_tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')
            self.gen_model = GPT2LMHeadModel.from_pretrained(pretrained_model_name_or_path=tentative_folder_path, pad_token_id=self.gen_tokenizer.eos_token_id)
            self.essence_ready = True

    def copy_snapshot(self):
        return {
            'output': '\n\n'.join(self.entry_contents)
        }

    def create_cache(self):
        print('Cache file doesn\'t exist, creating a new one...')

        self.entry_filenames = glob.glob(self.entry_regex, recursive=True)
        self.entry_contents = [md_to_text(
            file) for file in self.entry_filenames]
        self.entry_embeddings = list(self.text_encoder.encode(
            self.entry_contents))

        self.create_entries_dict()
        pickle.dump(self.entries, open(self.cache_address, 'wb'))

    def create_entries_dict(self):
        self.entries = {}

        for entry_idx in range(len(self.entry_filenames)):
            self.entries[self.entry_filenames[entry_idx]] = (
                self.entry_contents[entry_idx], self.entry_embeddings[entry_idx])

    def load_cache(self):
        print('Previous cache file exists, loading it...')
        self.entries = pickle.load(open(self.cache_address, 'rb'))
        self.entry_filenames = list(self.entries.keys())
        self.entry_contents = [e[0] for e in self.entries.values()]
        self.entry_embeddings = [e[1] for e in self.entries.values()]

    def sync_cache(self):
        self.prune_cache_entries()
        self.update_cache_entries()
        self.add_cache_entries()

    def prune_cache_entries(self):
        print('Pruning cached entries which have been removed in the meanwhile...')
        actual_entry_filenames = glob.glob(self.entry_regex)

        new_entry_filenames = []
        new_entry_contents = []
        new_entry_embeddings = []

        for entry_idx, entry_filename in enumerate(self.entry_filenames):
            if entry_filename in actual_entry_filenames:
                new_entry_filenames += [self.entry_filenames[entry_idx]]
                new_entry_contents += [self.entry_contents[entry_idx]]
                new_entry_embeddings += [self.entry_embeddings[entry_idx]]

        self.entry_filenames = new_entry_filenames
        self.entry_contents = new_entry_contents
        self.entry_embeddings = new_entry_embeddings

        self.create_entries_dict()
        pickle.dump(self.entries, open(self.cache_address, 'wb'))

    def add_cache_entries(self):
        print('Caching new entries...')
        actual_entry_filenames = glob.glob(self.entry_regex)

        for entry_idx, entry_filename in enumerate(actual_entry_filenames):
            if entry_filename not in self.entry_filenames:
                self.entry_filenames.append(entry_filename)
                self.entry_contents.append(md_to_text(entry_filename))
                self.entry_embeddings.append(
                    self.text_encoder.encode(md_to_text(entry_filename)))

        self.create_entries_dict()
        pickle.dump(self.entries, open(self.cache_address, 'wb'))

    def update_cache_entries(self):
        print('Updating cached entries which have been modified in the meanwhile')

        for entry_idx, entry_filename in enumerate(self.entry_filenames):
            if self.entry_contents[entry_idx] != md_to_text(entry_filename):
                self.entry_contents[entry_idx] = md_to_text(entry_filename)
                self.entry_embeddings[entry_idx] = self.text_encoder.encode(self.entry_contents[entry_idx])

        self.create_entries_dict()
        pickle.dump(self.entries, open(self.cache_address, 'wb'))
