import React, { Component } from 'react'

declare module 'react-window' {
  export type DynamicSizeListProps = Omit<FixedSizeListProps, 'itemSize' | 'scrollToItem'>
  export class DynamicSizeList extends Component<DynamicSizeListProps> {}
}