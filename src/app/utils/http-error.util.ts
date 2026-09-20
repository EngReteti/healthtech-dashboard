// A single, shared function for turning a raw HTTP error into a 
// plain-language message - used by every page that makes API calls, 
// so we only ever need to update this logic in ONE place
export function toFriendlyMessage(err: any): string {
  if (err.status === 403) {
    return "You don't have permission to do this action.";
  }
  if (err.status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (err.status === 404) {
    return 'The requested item could not be found.';
  }
  if (err.status === 0) {
    return 'Could not reach the server. Please check your connection.';
  }
  if (err.error?.error) {
    // Our backend's own clean, specific error message, when it has one -
    // e.g. "Cannot record movement: only 100 available, but 150 requested"
    return err.error.error;
  }
  return 'Something went wrong. Please try again.';
}
