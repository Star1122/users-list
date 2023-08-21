export const StarFilledIcon = ({
  size = 24, // or any default size of your choice
  color = 'currentColor', // or any color of your choice
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z" />
    </svg>
  );
};
