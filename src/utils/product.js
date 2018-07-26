export function parseRatingClass(rating) {
  return rating.toString().split('.').join('-');
}
