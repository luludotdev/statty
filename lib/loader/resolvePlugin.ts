import * as plugins from '~plugins'
import type { PluginFactory } from '~plugins'

export const resolvePlugin: (type: string) => PluginFactory | undefined =
  type_ => {
    const imports: unknown[] = Object.values(plugins)

    const factories: PluginFactory[] = imports.filter(
      (factory): factory is PluginFactory => {
        if (typeof factory !== 'function') return false

        // @ts-expect-error Symbol Lookup
        return factory.isFactory === plugins.IS_FACTORY
      }
    )

    return factories.find(({ type }) => type === type_)
  }
