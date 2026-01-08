export const convertDurationToMinutes = (duration: string) => {
  // Split the duration string into hours, minutes, and seconds
  const parts = duration.split(":");

  // Convert hours, minutes, and seconds to numbers
  const hours = parseInt(parts[0], 10) || 0; // Use parseInt with radix 10
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  // Calculate the total duration in minutes
  const totalMinutes = hours * 60 + minutes + seconds / 60;

  return {
    totalMinutes,
    hours,
    minutes,
    seconds,
  };
};
