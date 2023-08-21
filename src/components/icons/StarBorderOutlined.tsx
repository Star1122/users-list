export const StarBorderOutlinedIcon = ({
  size = 24, // or any default size of your choice
  color = 'currentColor', // or any color of your choice
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M22 9.74L14.81 9.12L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77L18.18 21.5L16.55 14.47L22 9.74ZM12 15.9L8.24 18.17L9.24 13.89L5.92 11.01L10.3 10.63L12 6.6L13.71 10.64L18.09 11.02L14.77 13.9L15.77 18.18L12 15.9Z" />
    </svg>
  );
};