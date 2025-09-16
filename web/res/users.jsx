import usersRaw from "./users.txt?raw";

export const users = usersRaw
  .split("\n")
  .map(line => line.trim())
  .filter(line => line.length > 0);