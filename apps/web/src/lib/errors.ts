// Texto curto de um erro para registro. Nunca inclui dados da pessoa.
export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}
