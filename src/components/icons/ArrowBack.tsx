export const ArrowBackIcon = ({
  size = 24, // or any default size of your choice
  color = 'currentColor', // or any color of your choice
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" />
    </svg>
  );
};
