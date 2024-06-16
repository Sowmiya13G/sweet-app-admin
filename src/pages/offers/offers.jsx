import React, { useEffect, useState } from "react";

// mui components
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
// firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
// firebase service
import { db } from "../../firebaseConfig";

//packages
import { useSwipeable } from "react-swipeable";
import SpecialOfferItem from "../../components/foodItem";

const Offers = () => {
  // local states
  const [uploading, setUploading] = useState(false);
  const [foodImgUploading, setFoodImgUploading] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [foods, setFoods] = useState([]);
  const [foodDetails, setFoodDetails] = useState({
    dishName: "",
    price: "",
    imgSrc: "",
    type: "",
    offer: "",
    priceAfterOffer: "",
  });
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [comboImages, setComboImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState([]);
  const [swipedItemId, setSwipedItemId] = useState(null);

  // -------------------------------- USE EFFECTS --------------------------------
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "foodList");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoods(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "offers");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoodList(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, []);

  useEffect(() => {
    if (foodDetails.type === "combo" && selectedFoods.length > 0) {
      const totalComboPrice = selectedFoods.reduce((total, foodName) => {
        const food = foods.find((f) => f.dishName === foodName);
        return total + (food ? parseFloat(food.price) : 0);
      }, 0);

      if (foodDetails.offer) {
        const offerPercentage = parseFloat(foodDetails.offer);
        const originalPrice = parseFloat(totalComboPrice);
        let priceAfterOfferCombo = (
          originalPrice -
          (originalPrice * offerPercentage) / 100
        ).toFixed(2);
        const images = selectedFoods.map((foodName) => {
          const food = foods.find((f) => f.dishName === foodName);
          console.log(food);
          return food.img;
        });
        setComboImages(images);
        setFoodDetails((prev) => ({
          ...prev,
          dishName: selectedFoods,
          price: totalComboPrice.toFixed(2),
          priceAfterOffer: priceAfterOfferCombo,
          imgSrc: comboImages,
        }));
      }
    }
  }, [selectedFoods]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "offers"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const newItem = {
          id: "new-id",
          name: "Add New",
        };
        const updatedItems = [newItem, ...items];
        setList(updatedItems);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // -------------------------------- COMPONENT STYLES --------------------------------

  const categoriesStyle = {
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    minHeight: 500,
  };

  const textInputStyle = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "initial",
        boxShadow: "none",
      },
    },
  };

  const foodGridStyles = {
    minHeight: { xs: 60, md: 50 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    borderRadius: 2,
    padding: 2,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    with: "100%",
    backgroundColor: "#ffffff",
    height: 500,
  };
  const scrollVerbarStyles = {
    overflowY: "auto",
    width: "100%",

    // overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none", // IE and Edge
    "scrollbar-width": "none", // Firefox
  };
  const scrollbarStyles = {
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  };
  // -------------------------------- FUNCTIONALITIES --------------------------------

  // food details input change
  const handleFoodInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "dishName") {
      const selectedFood = foods.find((food) => food.dishName === value);
      console.log(selectedFood);
      if (selectedFood) {
        setFoodDetails({
          ...foodDetails,
          [name]: value,
          price: selectedFood.price,
          img: selectedFood.img,
        });
      } else {
        setFoodDetails({
          ...foodDetails,
          [name]: value,
          price: "",
          imgSrc: "",
        });
      }
      if (name === "type") {
        setFoodDetails({
          dishName: "",
          price: "",
          imgSrc: "",
          type: "",
          offer: "",
          priceAfterOffer: "",
        });
        setSelectedFoods([]);
        setComboImages([]);
      }
    } else {
      setFoodDetails({ ...foodDetails, [name]: value });
    }
  };

  // adding food item under selected category
  const handleAddFoodItem = async () => {
    if (foodDetails.dishName && foodDetails.price) {
      setUploading(true);
      try {
        const priceAfterOffer = calculateAfterOfferPrice();
        await addDoc(collection(db, "offers"), {
          ...foodDetails,
          priceAfterOffer,
        });
        setFoodDetails({
          dishName: "",
          price: "",
          imgSrc: "",
          type: "",
          offer: "",
          priceAfterOffer: "",
        });

        setSelectedFoods([]);
        setComboImages([]);
      } catch (e) {
        console.error("Error adding food item: ", e);
      } finally {
        setUploading(false);
      }
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleComboFoodChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedValues = Array.isArray(value) ? value : [value];
    setSelectedFoods(selectedValues);
  };

  const handleDeleteClick = (event, foodToDelete) => {
    event.stopPropagation();
    const updatedSelected = selectedFoods.filter(
      (food) => food !== foodToDelete
    );
    setSelectedFoods(updatedSelected);
  };

  const calculateAfterOfferPrice = () => {
    if (foodDetails.offer && foodDetails.price) {
      const offerPercentage = parseFloat(foodDetails.offer);
      const originalPrice = parseFloat(foodDetails.price);
      return (originalPrice - (originalPrice * offerPercentage) / 100).toFixed(
        2
      );
    }
    return "";
  };

  // Handle edit food
  const handleEditFood = (food) => {
    console.log(food);
    let selectedCard = null;
    for (const item of list) {
      if (item.dishName === food.dishName) {
        selectedCard = item;
        break;
      }
    }
    setSelectedCard(food);
    setEdit(true);
    if (food.type === "special") {
      setFoodDetails({
        dishName: food?.dishName,
        price: food?.price,
        imgSrc: food?.img,
        type: food?.type,
        offer: food?.offer,
        priceAfterOffer: food?.priceAfterOffer,
      });
    }
    if (food.type === "combo") {
      setSelectedFoods(food?.dishName);
      setComboImages(food?.imgSrc);
      setFoodDetails({
        dishName: food?.dishName,
        price: food?.price,
        imgSrc: food?.imgSrc,
        type: food?.type,
        offer: food?.offer,
        priceAfterOffer: food?.priceAfterOffer,
      });
    }
  };

  const handleUpdateFood = async () => {
    let selectedCard = null;
    for (const item of list) {
      if (item.dishName === foodDetails.dishName) {
        selectedCard = item;
        break;
      }
    }
    setSelectedCard(selectedCard);
    console.log(foodDetails, selectedCard, "foodDetails");
    if (
      foodDetails &&
      foodDetails.dishName &&
      foodDetails.price &&
      selectedCard &&
      selectedCard?.id
    ) {
      try {
        const priceAfterOffer = calculateAfterOfferPrice();
        const foodDocRef = doc(db, "offers", selectedCard?.id);
        console.log(selectedCard.id, "foodDocRef", foodDocRef);

        await updateDoc(foodDocRef, {
          dishName: foodDetails.dishName,
          price: foodDetails.price,
          offer: foodDetails.offer,
          priceAfterOffer: priceAfterOffer,
          img: foodDetails.imgSrc,
          imgSrc: foodDetails.imgSrc,
          type: foodDetails.type,
        });

        setSelectedCard(null);

        setFoodDetails({
          dishName: "",
          price: "",
          imgSrc: "",
          type: "",
          offer: "",
          priceAfterOffer: "",
        });
        setSelectedFoods([]);
        setComboImages([]);

        console.log("Food item updated successfully");
      } catch (error) {
        console.error("Error updating food item:", error);
        console.log(JSON.stringify(error));
      }
    } else {
      console.error(
        "Missing required properties in foodDetails object for update."
      );
    }
  };

  const handleDeleteFood = async (food) => {
    let selectedCard = null;
    for (const item of list) {
      if (item.dishName === food.dishName) {
        selectedCard = item;
        break;
      }
    }
    setSelectedCard(selectedCard);

    if (selectedCard) {
      try {
        const foodDoc = doc(db, "offers", selectedCard.id);
        await deleteDoc(foodDoc);
        setSelectedCard(null);
      } catch (e) {
        console.error("Error deleting food item: ", e);
      }
    }
  };

  // -------------------------------- RENDER UI --------------------------------

  const renderAddFoodFields = () => {
    return (
      <Box sx={categoriesStyle}>
        <Typography
          gutterBottom
          sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
        >
          Add Offers
        </Typography>
        <Divider
          sx={{ backgroundColor: "#00000090", width: "100%", my: 1, mb: 2 }}
        />
        <TextField
          label="Offer Type"
          name="type"
          value={foodDetails.type}
          onChange={handleFoodInputChange}
          select
          fullWidth
          sx={{ mb: 2, ...textInputStyle }}
        >
          <MenuItem value="special">Special</MenuItem>
          <MenuItem value="combo">Combo</MenuItem>
        </TextField>
        {foodDetails.type === "combo" ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                padding: "10px",
              }}
            >
              {selectedFoods.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={(event) => handleDeleteClick(event, value)}
                  deleteIcon={<CancelIcon />}
                />
              ))}
            </Box>

            <Select
              multiple
              displayEmpty
              value={selectedFoods}
              onChange={handleComboFoodChange}
              input={<OutlinedInput />}
              renderValue={() => {
                if (selectedFoods.length === 0) {
                  return <em>Select Foods </em>;
                }
                return <em>Selected Foods for combo</em>;
              }}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            >
              {filteredFoods.map((food) => (
                <MenuItem key={food.id} value={food.dishName}>
                  {food.dishName}
                </MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <TextField
            label="Food Name"
            name="dishName"
            value={foodDetails.dishName}
            onChange={handleFoodInputChange}
            fullWidth
            select
            sx={{ mb: 2, ...textInputStyle }}
          >
            {filteredFoods.map((food) => (
              <MenuItem key={food.id} value={food.dishName}>
                {food.dishName}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Offer"
          name="offer"
          value={foodDetails.offer}
          onChange={handleFoodInputChange}
          fullWidth
          sx={{ mb: 2, ...textInputStyle }}
        />
        <TextField
          label="Price"
          name="price"
          value={foodDetails.price}
          onChange={handleFoodInputChange}
          fullWidth
          disabled={foodDetails.type === "combo"}
          sx={{ mb: 2, ...textInputStyle }}
        />
        <TextField
          label="After Offer Price"
          name="afterOfferPrice"
          value={calculateAfterOfferPrice()}
          fullWidth
          disabled
          sx={{ mb: 2, ...textInputStyle }}
        />
        {Boolean(foodDetails.dishName) && (
          <Box sx={{ my: 2, width: 200, height: 200 }}>
            {foodImgUploading ? (
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: 10,
                  borderRadius: 5,
                }}
              >
                <CircularProgress />
              </Box>
            ) : foodDetails.type === "combo" ? (
              comboImages.map((item, index) => (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <img
                    key={index}
                    src={item}
                    width={"50%"}
                    height={"50%"}
                    style={{ borderRadius: 10 }}
                    alt="img"
                  />
                </Box>
              ))
            ) : (
              foodDetails.imgSrc && (
                <img
                  src={foodDetails.imgSrc}
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: 10 }}
                  alt="img"
                />
              )
            )}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ height: 40, width: "40%" }} />
          <Button
            variant="contained"
            color={edit ? "info" : "success"}
            onClick={edit ? handleUpdateFood : handleAddFoodItem}
            sx={{
              height: 40,
              width: "45%",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            {edit ? "Update" : "Add"}
          </Button>
        </Box>
      </Box>
    );
  };

  const specialOfferList = () => {
    const specialOffers = foodList.filter((food) => food.type === "special");
    return (
      <Paper
        elevation={6}
        sx={{
          ...foodGridStyles,
        }}
      >
        <Box
          sx={{
            flexDirection: "row",
            justifyItems: "space-between",
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#000",
            }}
          >
            Special Offers
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#00000011", width: "100%", mb: 2 }} />
        <Box sx={{ ...scrollVerbarStyles, width: "100%" }}>
          {specialOffers.length > 0 ? (
            specialOffers.map((food) => {
              return (
                <>
                  <SpecialOfferItem
                    key={food.id}
                    food={food}
                    deleteFood={() => handleDeleteFood(food)}
                    handleEditFood={()=>handleEditFood(food)}
                    selectedCard={selectedCard}
                  />
                </>
              );
            })
          ) : (
            <Typography
              gutterBottom
              sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
            >
              No Special Offers added yet.
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", mt: 4 }}>
        Offers
      </Typography>

      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          width: "100%",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "25%" }, my: 2 }}>
          {renderAddFoodFields()}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "35%" }, my: 2 }}>
          {specialOfferList()}
        </Box>
      </Box>
    </Box>
  );
};

export default Offers;
