import chalk from "chalk";

/**
 * Format a string with a specified prefix.
 * @param {string} str - The string to format.
 * @returns {string} - Formatted string.
 */
export function formatSeperatorString(str: string): string {
  const line = Array.from({ length: 15 }, () => "-").join("");
  return chalk.blue([line, str, line].join(" "));
}
