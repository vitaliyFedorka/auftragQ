export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Incorrect email or password.';
    }
    if (error.message.includes('User already registered')) {
      return 'An account with this email already exists.';
    }
    if (error.message.includes('Network request failed')) {
      return 'No internet connection. Please check your network and try again.';
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
