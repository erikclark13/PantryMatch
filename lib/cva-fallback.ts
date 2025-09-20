export type VariantProps<T> = any

export function cva(base: string, config?: any) {
  return (props?: any) => {
    if (!config || !props) return base

    let classes = base

    if (config.variants && props) {
      Object.keys(props).forEach((key) => {
        const variant = config.variants[key]
        const value = props[key]
        if (variant && variant[value]) {
          classes += ` ${variant[value]}`
        }
      })
    }

    return classes
  }
}
