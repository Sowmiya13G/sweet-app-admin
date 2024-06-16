import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

const SpecialOfferItem = ({
  food,
  deleteFood,
  handleEditFood,
  selectedCard,
  index,
}) => {
  const [swipedCardId, setSwipedCardId] = useState(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => setSwipedCardId(selectedCard?.id),
    onSwipedRight: () => setSwipedCardId(null),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Box
        {...handlers}
        sx={{
          display: "flex",
          flexDirection: "row",
          mb: 2,
          alignItems: "center",
          backgroundColor:
            selectedCard?.id === swipedCardId ? "#00000021" : "#00000011",
          width: "100%",
          borderRadius: "10px",
          minHeight: 120,
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.2s ease-in-out",
          transform:
            selectedCard?.id === swipedCardId
              ? "translateX(-10%)"
              : "translateX(0)",
        }}
      >
        <Box sx={{ flex: 1, padding: "0 10px" }}>
          <Typography sx={{ color: "#000", fontSize: 16, fontWeight: 600 }}>
            Dish Name: {food.dishName}
          </Typography>
          <Typography
            sx={{
              color: "#e32626",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "line-through",
            }}
          >
            {`Price: ₹ ${food.price}`}
          </Typography>
          <Typography sx={{ color: "#005700", fontSize: 12, fontWeight: 600 }}>
            {`Offer ${food.offer}%`}
          </Typography>
          <Typography sx={{ color: "#005700", fontSize: 16, fontWeight: 600 }}>
            {` ₹ ${food.priceAfterOffer}`}
          </Typography>
        </Box>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditFood();
          }}
          sx={{ position: "absolute", top: 5, right: 0 }}
        >
          <BorderColorIcon sx={{ height: 15, color: "#000" }} />
        </Button>

        <Box
          sx={{
            width: 100,
            minHeight: 100,
            m: "auto",
            display: "flex",
            alignItems: "center",
            mr: "10px",
          }}
        >
          <img
            src={food.img}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: 80,
              height: 80,
            }}
            alt="Food"
          />
        </Box>
      </Box>
      {food.id === swipedCardId && (
        <IconButton
          sx={{
            justifySelf: "center",
            transition: "transform 0.2s ease-in-out",
            color: "#e32626",
            height: 40,
            width: 40,
          }}
          onClick={deleteFood}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default SpecialOfferItem;
