/* This is the stack to store the directories, basically when we click on a new folder/directory we push 
a new directory to the stack, and pop it when we're done. This makes it a lot easier to navigate between directories 

I thought about just using string manipulation to just pop off the recent directory and then update the apollo hook, but 
that could probably be a little dangerous if there are some characters/escape keys that get in the way */

export default class DirectoryStack {
  constructor() {
    this.data = [];
    this.top = 0;
  }
  push(element) {
    this.data[this.top] = element;
    this.top = this.top + 1;
  }
  length() {
    return this.top;
  }
  peek() {
    return this.data[this.top - 1];
  }
  isEmpty() {
    return this.top === 0;
  }
  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.data.pop(); // removes the last element
    }
  }
}
