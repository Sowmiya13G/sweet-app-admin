import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { db } from "../firebaseConfig";

const SpecialOfferItem = ({
  food,
  deleteFood,
  handleEditFood,
  selectedCard,
  index,
  type,
}) => {
  const [swipedCardId, setSwipedCardId] = useState(null);

  const isSpecial = type === "special";

  const handlers = useSwipeable({
    onSwipedLeft: () => setSwipedCardId(food?.id),
    onSwipedRight: () => setSwipedCardId(null),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleCheckToggle = async (food) => {
    try {
      const foodDoc = doc(db, "offers", food?.id);
      await updateDoc(foodDoc, {
        topRec: !food.topRec,
      });
      console.log("updated successfully")
    } catch (e) {
      console.error("Error toggling sold out status: ", e);
    }
  };

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
            food?.id === swipedCardId ? "#00000021" : "#00000011",
          width: "100%",
          borderRadius: "10px",
          minHeight: 120,
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.2s ease-in-out",
          transform:
            food?.id === swipedCardId ? "translateX(-10%)" : "translateX(0)",
        }}
      >
        <Checkbox
          checked={food?.topsRec}
          onChange={() => handleCheckToggle(food)}
          icon={
            <span
              style={{
                display: "inline-block",
                width: 15,
                height: 15,
                border: "2px solid black",
                margin: "3.5px",
              }}
            />
          }
          sx={{
            // "& .MuiSvgIcon-root": {
            //   color: foodDetails?.topRec ? "Green" : "black",
            // },
            color: "#626fa0",
            position: "absolute",
            top: isSpecial ? "10px" : "1px",
          }}
        />
        <Box sx={{ flex: 1, padding: "0 10px", px: 5 }}>
          <Typography sx={{ color: "#000", fontSize: 16, fontWeight: 600 }}>
            {`Dish Name: ${
              isSpecial ? food.dishName : food.dishName.join(", ")
            }`}
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
            gap: "10px",
            flexDirection: "row",
            paddingRight: "10px",
            justifyContent: "center",
          }}
        >
          {isSpecial ? (
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
          ) : (
            <>
              {food.imgSrc.slice(0, 2).map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    width: 55,
                    height: 55,
                    position: "absolute",
                    right: idx * 20 + 30,
                  }}
                  alt={`Food ${idx + 1}`}
                />
              ))}
            </>
          )}
        </Box>
      </Box>
      {food?.id === swipedCardId && (
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
