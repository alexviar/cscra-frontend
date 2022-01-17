import { Factory } from 'fishery';

export class BaseFactory<T, I = any> extends Factory<T, I> {
  data: T[] = []

  push(item: T) {
    this.data.push(item)
  }

  clear() {
    this.data = []
  }

  remove(e: T) {
    this.data = this.data.filter((d) => d !== e)
  }
}