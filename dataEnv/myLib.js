export const getUniqueId = () => {
  const base = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const baseLength = base.length;
  let uniqueId = "";

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * baseLength);

    uniqueId += base[randomIndex];
  }

  return uniqueId;
};
