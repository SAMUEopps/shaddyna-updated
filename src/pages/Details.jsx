import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiMinus } from "react-icons/fi";
import { FaArrowsSpin, FaPlus } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/pagination";
import Ratings from "../components/Ratings";
import { AiFillHeart } from "react-icons/ai";
import Reviews from "../components/Reviews";
import { useDispatch, useSelector } from "react-redux";
import { add_to_card, messageClear } from "./../store/reducers/cardReducer";
import { toast } from "react-hot-toast";
import { get_product } from "../store/reducers/homeReducer";
import PageHeader from "./PageHeader";

const Details = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [image, setImage] = useState("");
  const [state, setState] = useState("reviews");
  const [color, setColor] = useState("");
  const { product, relatedProducts, totalReview } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.card);
  const [moveTop, setMoveTop] = useState("");

  const [quantity, setQuantity] = useState(1);

  const inc = () => {
    if (quantity >= product.stock) {
      toast.error("Out of stock");
    } else {
      setQuantity(quantity + 1);
    }
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const add_card = () => {
    if (userInfo) {
      dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId: product._id,
          color,
        })
      );
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(get_product(slug));
  }, [slug]);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage]);

  const buy = () => {
    let price = 0;
    if (product.discount !== 0) {
      price = product.price - Math.floor((product.price * product.discount) / 100);
    } else {
      price = product.price;
    }
    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (price - Math.floor((price * 5) / 100)),
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ];
    navigate("/shipping", {
      state: {
        products: obj,
        price: price * quantity,
        shipping_fee: 85,
        items: 1,
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moveTop]);

  return (
    <div className="bg-slate-100">
      <Headers />
      <PageHeader title="" category={product.category} slug={product.name} />
      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full  mt-6 mx-auto pb-16">
          <div className="grid grid-cols-2 md-lg:grid-cols-1 gap-8">
            <div className="flex gap-3 flex-row-reverse items-center justify-between md-lg:justify-center ">
              <div className="p-2 border relative">
                <div className="hover-zoom">
                  <img
                    className="h-[360px] w-[350px] sm:h-[250px] sm:w-[245px]"
                    src={image ? image : product.images?.[0]}
                    alt=""
                  />
                </div>
              </div>
              <div className="py-3 flex flex-col gap-2">
                {product.images &&
                  product.images.map((img, i) => {
                    return (
                      <div key={i} onClick={() => setImage(img)} className="shadow-md">
                        <img
                          className="h-[110px] w-[120px] sm:w-[80px] sm:h-[75px] cursor-pointer "
                          src={img}
                          alt=""
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-3xl text-slate-600 font-bold">
                <h2>{product.name}</h2>
              </div>
              <div className="flex justify-start items-center gap-4">
                <div className="flex text-xl">
                  <Ratings ratings={product.rating} />
                </div>
                <span className="text-blue-400">({totalReview} reviews)</span>
              </div>
              <div className="text-2xl text-pink-400 font-bold flex gap-3">
                {product.discount !== 0 ? (
                  <>
                    <h2 className="line-through">Ksh{product.price}</h2>
                    <h2>
                      Ksh{product.price - Math.floor((product.price * product.discount) / 100)} (-
                      {product.discount}%)
                    </h2>
                  </>
                ) : (
                  <h2>Price : Ksh{product.price}</h2>
                )}
              </div>
              <div className="flex gap-7 pb-2 ">
                {product.stock ? (
                  <>
                    <div className="flex justify-center items-center text-xl">
                      <div
                        onClick={dec}
                        className=" cursor-pointer p-4 sm:p-2 bg-slate-300 hover:bg-slate-400     "
                      >
                        <FiMinus />
                      </div>
                      <div className="p-3 px-4  sm:px-2  sm:p-1  bg-slate-300 ">{quantity}</div>
                      <div
                        onClick={inc}
                        className=" cursor-pointer  p-4  sm:p-2  bg-slate-300  hover:bg-slate-400"
                      >
                        <FaPlus />
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="flex gap-3">
                  <div className="h-[50px] w-[50px] sm:w-[35px] sm:h-[35px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-pink-500/40 bg-blue-400 text-white">
                    <AiFillHeart />
                  </div>
                  <div className="h-[50px] w-[50px] sm:w-[35px] sm:h-[35px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-pink-500/40 bg-blue-400 text-white">
                    <FaArrowsSpin />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pb-2 font-medium">
                {product.colorArray &&
                  product.colorArray.map((item, i) => {
                    return (
                      <span
                        key={i}
                        onClick={() => setColor(item)}
                        style={{ backgroundColor: item }}
                        className={`w-10 h-10 rounded-full cursor-pointer ${
                          color == item ? " border-4 border-gray-400 shadow-lg" : ""
                        }`}
                      ></span>
                    );
                  })}
              </div>
              <div className="flex gap-3 font-medium">
                <button
                  onClick={add_card}
                  className="px-8 w-full py-3 sm:px-3 sm:py-1 cursor-pointer hover:shadow-lg border-2 hover:bg-pink-400 border-blue-400 bg-white-500 text-pink-400 hover:text-white"
                >
                  Add To Card
                </button>
                {product.stock ? (
                  <button
                    onClick={buy}
                    className="px-8 w-full py-3 sm:px-3 sm:py-1 cursor-pointer hover:shadow-lg hover:shadow-pink-400/40 bg-blue-400 text-white"
                  >
                    Buy Now
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className="flex ">
                <div className="w-[150px] text-black font-bold text-xl ">
                  <span>Availability :</span>
                </div>
                <div className="flex">
                  <span className={`text-${product.stock ? "blue" : "pink"}-400`}>
                    {product.stock ? `In Stock(${product.stock})` : "Out of Stock"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <div className="w-[150px] text-black font-bold text-xl ">
                  <span>Tags :</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {product.tagArray &&
                    product.tagArray.map((item, i) => {
                      return (
                        <span key={i} className="bg-slate-300 text-sm font-medium px-2 py-1">
                          {item}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="pr-4 md-lg:pr-0">
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-5 sm:gap-2 font-medium">
                  <button
                    onClick={() => setState("reviews")}
                    className={`py-2 hover:text-white px-7 sm:px-2 sm:py-1 hover:bg-pink-400 ${
                      state === "reviews" ? "bg-blue-400 text-white " : "bg-slate-100  text-slate-700 "
                    } rounded-sm border-2 border-blue-400`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setState("description")}
                    className={`py-2 px-7 sm:px-2 sm:py-1  hover:text-white hover:bg-pink-400 ${
                      state === "description" ? "bg-blue-400 text-white" : "bg-slate-100 text-slate-700"
                    } rounded-sm border-blue-400 border-2`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setState("care-guide")}
                    className={`py-2 px-7  sm:px-2 sm:py-1 hover:text-white hover:bg-pink-400 ${
                      state === "care-guide" ? "bg-blue-400 text-white" : "bg-slate-100 text-slate-700"
                    } rounded-sm border-blue-400 border-2`}
                  >
                    Care Guide
                  </button>
                </div>
                <div>
                  {state === "reviews" ? (
                    <Reviews product={product} />
                  ) : state === "description" ? (
                    <p className="py-5 text-slate-600">{product.description}</p>
                  ) : (
                    <div className="py-5 text-slate-600">
                      <div className=" mx-auto mt-4 rounded-lg">
                        <h1 className="text-xl font-bold mb-4 text-center">Product Care Guide</h1>
                        <p className="mb-4">
                          Thank you for choosing our product! Proper care and maintenance will ensure its
                          longevity and optimal performance. Please follow these simple guidelines:
                        </p>
                        <ul className="list-disc pl-6 mb-4">
                          <li>
                            <strong>Cleaning:</strong> Regularly clean the product with a soft, damp cloth to
                            remove dust and debris. Avoid abrasive cleaners that may scratch the surface.
                          </li>
                          <li>
                            <strong>Storage:</strong> Store the product in a cool, dry place away from direct
                            sunlight to prevent discoloration or warping.
                          </li>
                          <li>
                            <strong>Avoid Moisture:</strong> Keep the product away from moisture and humidity
                            to prevent damage such as mold or rust.
                          </li>
                          <li>
                            <strong>Handling:</strong> Handle the product with care to avoid accidental
                            damage. Use caution when moving or transporting it to prevent breakage.
                          </li>
                          <li>
                            <strong>Avoid Harsh Chemicals:</strong> Do not use harsh chemicals or solvents on
                            the product, as they may cause damage to the finish or material.
                          </li>
                          <li>
                            <strong>Regular Inspection:</strong> Periodically inspect the product for any
                            signs of wear or damage. Address any issues promptly to prevent further
                            deterioration.
                          </li>
                          <li>
                            <strong>Follow Manufacturer's Instructions:</strong> Always follow any specific
                            care instructions provided by the manufacturer for the best results.
                          </li>
                        </ul>
                        <p className="mb-4">
                          By following these care guidelines, you can ensure that your product remains in
                          excellent condition for years to come. If you have any further questions or
                          concerns, please don't hesitate to contact us.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
          <h2 className="text-2xl py-8 text-slate-600">Related Products</h2>
          <div>
            <Swiper
              slidesPerView="auto"
              breakpoints={{
                1280: {
                  slidesPerView: 4,
                },
                565: {
                  slidesPerView: 2,
                },
              }}
              spaceBetween={25}
              loop={true}
              pagination={{
                clickable: true,
                el: ".custom_bullet",
              }}
              className="mySwiper"
            >
              {relatedProducts.map((p, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Link
                      to={`/product/details/${p.slug}`}
                      onClick={() => setMoveTop(true)}
                      className="block bg-slate-50 p-1"
                    >
                      <div className="relative h-[240px]">
                        <div className="w-full h-full">
                          <img className="w-full h-full" src={p.images[0]} />
                          <div className="absolute h-full w-full top-0 left-0 bg-[#000] opacity-25 hover:opacity-50 transition-all duration-500"></div>
                        </div>
                        {p.discount !== 0 && (
                          <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-pink-400 font-semibold text-xs left-2 top-2">
                            {p.discount}%
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <h2 className="text-slate-600 text-lg font-semibold">{p.name}</h2>
                        <div className="flex justify-start items-center gap-3">
                          <h2 className="text-blue-400 text-lg font-bold">Ksh{p.price}</h2>
                          <div className="flex">
                            <Ratings ratings={p.rating} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="w-full flex justify-center items-center py-10">
            <div className="custom_bullet justify-center gap-3 !w-auto"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Details;
