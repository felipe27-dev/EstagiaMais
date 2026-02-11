import Button from "@mui/material/Button";

export const AppButton = ({ 
  children,
  onClick, 
  color = "primary", 
  variant = "contained",
  sx = {},
  padding = "6px 8px",
  radius = "40px",
  fontSize = "21px",
  ...props 
}) => {
  
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      sx={{
        fontWeight: "bold",
        backgroundColor: color,
        color: variant === "contained" ? "#fff" : color, 
        
        "&:hover": {
          backgroundColor: `color-mix(in srgb, ${color}, black 15%)`,
        },
        
        padding: padding,
        borderRadius: radius,
        textTransform: "none",
        fontSize: fontSize,
        boxShadow: 3,
        ...sx, 
      }}
      {...props}
    >
      {children}
    </Button>
  );
};