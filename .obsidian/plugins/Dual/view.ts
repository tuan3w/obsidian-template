import { ItemView, WorkspaceLeaf, Notice, TextAreaComponent } from 'obsidian';

export default class ChatView extends ItemView {

	customName = '';

	constructor(leaf: WorkspaceLeaf, customName: string) {
	  super(leaf);
	  this.customName = customName;
	}
  
	getViewType(): string {
	  return "chat"
	}
  
	getDisplayText(): string {
	  return "Dual"
	}
  
	getIcon(): string {
	  return "info"
	}

    sendMessage(): void {
        let input = <HTMLInputElement> document.getElementById('dual-input-box');
		let replied = false;

		if (input.value != '') {
			this.drawMessage(input.value, 'right');
			
			let typingPromise = new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
				if (replied == false) {
					this.setStatus('typing...');
				}
			});

			this.makeRequest(input.value).then((response: any) => {

				if (response['intent'] == 'DESCRIPTIVE_SEARCH' || response['intent'] == 'FLUID_SEARCH') {
					if (response['output'].length > 0) {				
						response['output'].forEach((element: string) => {
							this.drawMessage(element.split('\\').pop().split('/').pop(), 'left');
						});
					} else {
						this.drawMessage('I can\'t find any relevant entries. Try a different search.', 'left');
					}
				} else {
					this.drawMessage(response['output'], 'left');
				}

				replied = true;
				this.setStatus('online');

			});

			input.value = '';
		}
    }

    async makeRequest(query: string): Promise<JSON> {
        const response = await fetch('http://127.0.0.1:5000/query/' + encodeURIComponent(query));
        const responseJSON = await response.json();
        return responseJSON
    }

	load(): void {
		super.load()
		this.draw();
    }

	private draw(): void {
		const container = this.containerEl.children[1];
	
		const rootEl = document.createElement('div');
	
		const headerDiv = rootEl.createDiv({ cls: 'nav-header' });
		const footerDiv = rootEl.createDiv({ cls: 'nav-header' });

		let header = headerDiv.createEl('h3');
		header.appendText(this.customName);
		header.style.textAlign = 'left';
		header.style.marginTop = '0px';
		header.style.marginBottom = '0px';
        header.style.position = 'absolute';
        header.style.top = '15px';

		let status = headerDiv.createEl('h6');
		status.id = 'status';
		status.appendText('online');
		status.style.textAlign = 'left';
		status.style.marginTop = '0px';
		status.style.marginBottom = '5px';
		status.style.color = 'grey'

		let conversationDiv = headerDiv.createDiv({ cls: 'nav-header' });
        conversationDiv.id = 'conversationDiv'
		conversationDiv.style.padding = '0';
        conversationDiv.style.backgroundColor = 'var(--background-secondary-alt)';
        conversationDiv.style.position = 'absolute';
        conversationDiv.style.left = '0';
        conversationDiv.style.width = '100%';
        conversationDiv.style.paddingLeft = '10px';
        conversationDiv.style.paddingRight = '10px';
        conversationDiv.style.overflowY = 'scroll';
        conversationDiv.style.height = 'calc(100% - 110px)'

		let input = footerDiv.createEl('input');
        input.id = 'dual-input-box';
		input.type = 'text';
        input.style.fontSize = '0.8em'
		input.style.paddingInlineStart = '2%'
		input.style.paddingInlineEnd = '2%'
		input.style.marginTop = '0px';
		input.style.marginBottom = '10px';
		input.style.maxWidth = '68%';
        input.style.minWidth = '68%';
		input.style.position = 'absolute';
		input.style.bottom = '0';
		input.style.left = '5%';

		let button = footerDiv.createEl('button');
		button.appendText('Send');
        button.id = 'send-button';
		button.style.alignItems = 'left';
		button.style.paddingInlineStart = '2%';
		button.style.paddingInlineEnd = '2%';
		button.style.marginTop = '0px';
		button.style.marginBottom = '10px';
        button.style.width = '20%';
		button.style.position = 'absolute';
		button.style.bottom = '0';
		button.style.left = '75%';
        
        this.registerDomEvent(button, 'click', () => this.sendMessage());
		this.registerDomEvent(input, 'keydown', (event) => {
			if (event.key == 'Enter') {
				this.sendMessage();
			}
		})
	
		container.empty();
		container.appendChild(rootEl);
	  }

    private drawMessage(content: string, side: string): void {
        let conversationDiv = <HTMLDivElement> document.getElementById('conversationDiv');
        let p = conversationDiv.createEl('p');
		p.appendText(content);
		p.style.userSelect = 'text';
		p.style.textAlign = 'left';
		p.style.fontSize = '0.8em';
		p.style.borderRadius = '5px';
		p.style.lineHeight = '18px';
		p.style.padding = '5px';

		if (side == 'right') {
            p.style.backgroundColor = 'var(--background-primary)';
		} else {
			p.style.backgroundColor = 'var(--background-secondary)';
		}

        p.style.width = '90%';
        p.style.position = 'relative';

        if (side == 'right') {
            p.style.left = '10%';
        }

		conversationDiv.scrollBy(0, 1000);
    }

	private setStatus(content: string): void {
		let statusP = <HTMLParagraphElement> document.getElementById('status')
		statusP.setText(content);
	}
}