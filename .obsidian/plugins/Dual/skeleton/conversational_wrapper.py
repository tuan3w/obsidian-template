from core import Core
import re


class ConversationalWrapper:
    def __init__(self, root_dir):
        self.core = Core(root_dir)
        
    def respond(self, query):
        query = query.strip()

        if query == '':
            return None

        if re.match(r'.*[copy|get]\s+snapshot.*', query.lower()):
            return {
                'intent': 'COPY_SNAPSHOT',
                'input': query,
                'output': self.core.copy_snapshot()
            }
        elif '?' in query or re.match(r'^(why|what|when|where|who|how).*', query.lower()):
            return {
                'intent': 'OPEN_DIALOGUE',
                'input': query,
                'output': self.core.open_dialogue(query)
            }
        elif re.match(r'.*(this\s+(text|note|entry)).*', query.lower()):
            return {
                'intent': 'DESCRIPTIVE_SEARCH',
                'input': query,
                'output': self.core.descriptive_search(query)
            }
        elif m := re.match(r'.*(([Ss]earch\s+for|[Ll]ook\s+for|[Ff]ind)\s+(a\s+text|a\s+note|an\s+entry)\s+(that|which))\s+(.*)', query):
            return {
                'intent': 'DESCRIPTIVE_SEARCH',
                'input': 'This text ' + m.group(5),
                'output': self.core.descriptive_search('This text ' + m.group(5))
            }
        else:
            if m:= re.match(r'.*(([Ss]earch\s+for|[Ll]ook\s+for|[Ll]ook\s+up|[Ff]ind)\s*(a\s+note|an\s+entry|a\s+text|notes|entries|texts)?\s*(on|about|related\s+to)?)\s+([^\.]*)', query):
                query = m.group(5)
            return {
                'intent': 'FLUID_SEARCH',
                'input': query,
                'output': self.core.fluid_search(query)
            }
