import React, { useEffect, useState } from "react";

// mui components
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Select,
  Chip,
  OutlinedInput,
} from "@mui/material";
// firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// firebase service
import { db } from "../../firebaseConfig";

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
  const [selectedCard, setSelectedCard] = useState("");

  // variables

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

  // upload image file for the food item
  const handleFoodFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodImgUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `foodList/${file.name}`);
      await uploadBytes(storageRef, file);
      const imgSrc = await getDownloadURL(storageRef);
      setFoodDetails((prev) => ({ ...prev, imgSrc }));
      setFoodImgUploading(false);
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

  const handleDeleteFood = async () => {
    if (selectedCard) {
      try {
        await deleteDoc(doc(db, "foodList", selectedCard));
        setSelectedCard(null);
      } catch (e) {
        console.error("Error deleting food item: ", e);
      }
    }
  };

  const handleFoodSearch = (e) => {
    setSearchTerm(e.target.value);
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

  // const generateRandomColor = () => {
  //   const letters = '0123456789ABCDEF';
  //   let color = '#';
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

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
              foodDetails.img && (
                <img
                  src={foodDetails.img}
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: 10 }}
                  alt="img"
                />
              )
            )}
          </Box>
        )}
        {/* 
        <Button
          variant="outlined"
          component="label"
          sx={{
            justifyContent: "space-between",
            display: "flex",
            height: 50,
            background: "transparent",
            marginBottom: "10px",
          }}
        >
          Upload File
          <CloudUploadIcon />
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            hidden
            onChange={handleFoodFileChange}
          />
        </Button> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ height: 40, width: "40%" }}
            onClick={handleDeleteFood}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddFoodItem}
            sx={{
              height: 40,
              width: "45%",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            Add
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
                <Box
                  key={food.id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 2,
                    alignItems: "center",
                    backgroundColor: "#00000011",
                    width: "100%",
                    borderRadius: "10px",
                    minHeight: 120,
                    ":hover": {
                      backgroundColor: "#00000021",
                      transition: "background-color 0.2s ease-in-out",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, padding: "0 10px" }}>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "#000",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Dish Name: {food.dishName}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "#e32626",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecorationLine: "line-through",
                      }}
                    >
                      {`Price: ₹ ${food.price}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: "#005700", fontSize: 12, fontWeight: 600 }}
                    >
                      {`offer ${food.offer}%`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: "#005700", fontSize: 16, fontWeight: 600 }}
                    >
                      {` ₹ ${food.priceAfterOffer}`}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 75, minHeight: 75, mx: 2 }}>
                    <img
                      src={food.img}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        width: 75,
                        height: 75,
                      }}
                      alt="Food"
                    />
                  </Box>
                </Box>
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

  const comboOfferList = () => {
    const comboOffers = foodList.filter((food) => food.type === "combo");
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
            Combo Offers
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#00000090", width: "100%", mb: 2 }} />
        <Box sx={{ ...scrollVerbarStyles, width: "100%" }}>
          {comboOffers.length > 0 ? (
            comboOffers.map((food) => {
              return (
                <Box
                  key={food.id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 2,
                    alignItems: "center",
                    backgroundColor: "#00000011",
                    width: "100%",
                    borderRadius: "10px",
                    minHeight: 120,
                    ":hover": {
                      backgroundColor: "#00000021",
                      transition: "background-color 0.2s ease-in-out",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, padding: "0 10px" }}>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "#000",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Dish Name: {food.dishName.join(", ")}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "#e32626",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecorationLine: "line-through",
                      }}
                    >
                      {`Price: ₹ ${food.price}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: "#005700", fontSize: 12, fontWeight: 600 }}
                    >
                      {`Offer: ${food.offer}%`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: "#005700", fontSize: 16, fontWeight: 600 }}
                    >
                      {` ₹ ${food.priceAfterOffer}`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "row",
                      paddingRight: "10px",
                    }}
                  >
                    {food.imgSrc.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        width={50}
                        height={50}
                        style={{ borderRadius: 5 }}
                        alt={`Food ${idx + 1}`}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography
              gutterBottom
              sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
            >
              No Combo Offers added yet.
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
        <Box sx={{ width: { xs: "100%", md: "35%" }, my: 2 }}>
          {comboOfferList()}
        </Box>
      </Box>
    </Box>
  );
};

export default Offers;
