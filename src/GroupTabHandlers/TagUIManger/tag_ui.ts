import CmdHandler, { Cmd } from '../CmdHandler/CmdHandler'

export class TagUI {
  public tagInput: Element
  public tagContainer: Element
  public movePicker: Element | null
  public cmdHandler = new CmdHandler()
  public currentCmd: string[] = []
  constructor() {
    this.tagInput = document.getElementById('tag-input') as Element
    this.tagContainer = document.querySelector('.tag-container') as Element
    this.movePicker = document.getElementById('move-picker')

    this.tagInput.addEventListener('keydown', this.tagInputKeyDown)

    const tagCloseBtns = document.querySelectorAll('.tag-remove')
    tagCloseBtns.forEach((tagCloseBtn) => {
      tagCloseBtn.addEventListener('click', (event: any) => {
        if (event.target.classList.contains('tag-remove')) {
          event.target.parentNode.remove()
          this.currentCmd.pop()
        }
      })
    })
  }
  public createTag = (text: string, command: boolean) => {
    if (text === '') return
    const tag = document.createElement('span')
    tag.classList.add('tag-item')
    if (command) {
      tag.classList.add('tag-command')
    }
    tag.setAttribute('contenteditable', 'false')
    const txtVal = text.trim()
    tag.innerHTML = `
      ${txtVal}
      <button class="tag-remove ml-1">&times;</button>
    `
    this.currentCmd.push(txtVal)
    tag.addEventListener('click', (event: any) => {
      if (event.target.classList.contains('tag-remove')) {
        event.target.parentNode.remove()
        this.currentCmd.pop()
      }
    })
    this.tagContainer.insertBefore(tag, this.tagInput?.parentNode)
    this.tagInput.textContent = ''
  }

  public clearMovePicker = () => {
    if (this.movePicker) this.movePicker.innerHTML = ''
  }

  public renderMovePicker = async () => {
    if (!this.movePicker) return
    const groupId = await this.cmdHandler.tabManager.getCurrentGroupId()
    if (groupId === null) {
      this.movePicker.innerHTML =
        '<div class="text-sm text-red-500 mt-2">current tab is not in a group</div>'
      return
    }
    const windows = await this.cmdHandler.tabManager.listTargetWindows()
    const escape = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) =>
          (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<
            string,
            string
          >)[c] || c),
      )
    const items = windows
      .map((w, i) => `<li class="truncate">${i + 1}. ${escape(w.title)}</li>`)
      .concat(`<li>${windows.length + 1}. New window</li>`)
      .join('')
    this.movePicker.innerHTML = `
      <div class="text-sm mt-2">
        <div class="mb-1 text-gray-500">pick target window:</div>
        <ol class="list-none pl-0">${items}</ol>
      </div>
    `
  }

  public tagInputKeyDown = async (event: any) => {
    if (event.keyCode === 32 || event.keyCode === 13) {
      //on press space or enter
      event.preventDefault()
      const text = this.tagInput?.textContent || ''
      const command = this.cmdHandler.isValidCmd(text)
      if (command) {
        this.currentCmd = []
        // this.tagContainer.querySelectorAll('span').forEach((span) => span.remove());
      }
      this.createTag(text, command)
      if (this.currentCmd.length == 0) {
        // console.log("skip empty cmd");
        return
      }
      console.log({ user_input: this.currentCmd })
      const cmdReport = this.cmdHandler.parseCmd({ user_input: this.currentCmd })
      console.log(JSON.stringify(cmdReport))
      console.log(`cmd is valid: ${cmdReport.cmd}`)

      if (cmdReport.cmd === Cmd.MOVE && cmdReport.args.length === 0) {
        await this.renderMovePicker()
        return
      }

      const { err, msg } = await this.cmdHandler.handleCmd({
        cmd: cmdReport.cmd,
        args: cmdReport.args,
      })
      console.log(JSON.stringify({ err, msg }))
      this.clearMovePicker()
    }

    if (event.keyCode === 8) {
      //on press backspace
      if (this.tagInput.textContent == '') {
        const lastSpan = Array.from(this.tagContainer.children)
          .filter((child) => child.tagName === 'SPAN')
          .pop()
        console.log(lastSpan)
        if (lastSpan) {
          lastSpan.remove()
          this.currentCmd = []
          this.currentCmd.length = 0
          this.clearMovePicker()
        }
      }
    }
  }
}
