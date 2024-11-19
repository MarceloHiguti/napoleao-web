import type { Context, Provider, ProviderExoticComponent, ProviderProps } from 'react';
import { useContext as reactUseContext, createContext as reactCreateContext } from 'react';

export interface CreateContextOptions {
  /**
   * If `true`, React will throw if context is `null` or `undefined`
   * In some cases, you might want to support nested context, so you can set it to `false`
   */
  readonly strict?: boolean;
  /**
   * Error message to throw if the context is `undefined`
   */
  readonly errorMessage?: string;
  /**
   * The display name of the context
   */
  readonly name?: string;
}

type CreateContextReturn<T> = [Provider<T>, () => T, Context<T>];

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */

export function useCreateContext<ContextType>(
  options: CreateContextOptions = {},
): [ProviderExoticComponent<ProviderProps<ContextType>>, () => ContextType, Context<ContextType>] {
  const {
    strict = true,
    errorMessage = 'useContext: `context` is undefined. Seems you forgot to wrap component within the Provider',
    name,
  } = options;
  const Context = reactCreateContext<ContextType | undefined>(undefined);
  Context.displayName = name;

  function useContext(): ContextType | undefined {
    const context = reactUseContext(Context);
    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = 'ContextError';
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }
    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<ContextType>;
}
