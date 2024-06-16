
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
                    position: "relative",
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
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFood(food);
                    }}
                    sx={{ position: "absolute", top: 5, right: 0 }}
                  >
                    <BorderColorIcon sx={{ height: 15, color: "#000" }} />
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "row",
                      paddingRight: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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


//   <Box sx={{ width: { xs: "100%", md: "35%" }, my: 2 }}>
//   {comboOfferList()}
// </Box>