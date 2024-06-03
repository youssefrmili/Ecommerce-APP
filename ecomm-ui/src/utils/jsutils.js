class Utils {
  static snakeCaseToTitleCase(str) {
    return str.replace(/_/g, " ").replace(/(?:^|\s)\S/g, function (match) {
      return match.toUpperCase();
    });
  }

  static convertToTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

export default Utils;
