import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useProductStore = defineStore("products", () => {
  //商品列表
  //price要是數字
  const products = ref([
    {
      id: 1,
      img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
      name: "烏龍奶茶",
      price: 350,
      inventory: 5,
    },
    {
      id: 2,
      img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
      name: "芋頭牛奶",
      price: 500,
      inventory: 6,
    },
    {
      id: 3,
      img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
      name: "柳橙汁",
      price: 200,
      inventory: 7,
    },
    {
      id: 4,
      img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
      name: "烏龍奶茶",
      price: 350,
      inventory: 5,
    },
    {
      id: 5,
      img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
      name: "芋頭牛奶",
      price: 500,
      inventory: 6,
    },
    {
      id: 6,
      img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
      name: "柳橙汁",
      price: 200,
      inventory: 7,
    },
    {
      id: 7,
      img: "https://lcp-prod-obs.line-scdn.net/0hB0cYFDAAHR9eIA3Q1u9iSA19EW5tURkXN1gAInplPHAITAkVNA4CDwxpP3NzUTERCQ0zHzpmPHcYETsvAhoHHHppKEoYVDEsOx8CJTlrPGQDWSEVOE4uCQ/f300",
      name: "烏龍奶茶",
      price: 350,
      inventory: 5,
    },
    {
      id: 8,
      img: "https://lcp-prod-obs.line-scdn.net/0ho2PNKBSEMB1tNyDS5aFPSj5qPGxeRjQVBE8tIElyEXYrTCdICBgUIDh-Pkg7TCQTOhoeHQlxEXUrBhYtMQ0qHkl-BUgrQxwtMgkUHjh8EFsSQQwXC1kDCw/f300",
      name: "芋頭牛奶",
      price: 500,
      inventory: 6,
    },
    {
      id: 9,
      img: "https://lcp-prod-obs.line-scdn.net/0h8Gm2tOW-Z2hQS3en2s4YPwAWaxljOmNgOTN6VXROUhMgOVxIZGl6DB5IbAcdJ3J1bG16ex0XbC19IVthCCVUaBFIagQoIXVhH3ZURSMNRSoWOkFbHA/f300",
      name: "柳橙汁",
      price: 200,
      inventory: 7,
    },
  ]);


  //取得所有可以購買的商品(庫存大於0) 記得計算要加computed!!!!
  const avaliableProducts = computed(() => {
    return products.value.filter((product) => product.inventory > 0);
  });

  //減少庫存
  const decreaseInventory = (ItemId) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product && product.inventory > 0) {
      product.inventory--;
    }
  };

  //增加庫存
  const increaseInventory = (ItemId) => {
    const product = products.value.find((product) => product.id === ItemId);

    if (product) {
      product.inventory++;
    }
  };
  return { products, avaliableProducts, decreaseInventory, increaseInventory }; //記得return
});


export const useBrandStore = defineStore("brand", () => {
  const brands = ref([
    {
      id: 1,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 2,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 3,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 4,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 5,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 6,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 7,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },
    {
      id: 8,
      name: "響泰多",
      category: "restaurant",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5jgx6p38VKEPBsUENg0i-VKEijO7R5g_pQ&s",
    },

    {
      id: 9,
      name: "星巴克",
      category: "cafe",
      imgUrl:
        "https://foodtracer.health.ntpc.gov.tw/WebUPD/foodtracer/FoodCompany/STARBUCKS-LOGO_22030310531630787.png",
    },
    {
      id: 10,
      name: "星巴克",
      category: "cafe",
      imgUrl:
        "https://foodtracer.health.ntpc.gov.tw/WebUPD/foodtracer/FoodCompany/STARBUCKS-LOGO_22030310531630787.png",
    },
    {
      id: 11,
      name: "星巴克",
      category: "cafe",
      imgUrl:
        "https://foodtracer.health.ntpc.gov.tw/WebUPD/foodtracer/FoodCompany/STARBUCKS-LOGO_22030310531630787.png",
    },
    {
      id: 12,
      name: "星巴克",
      category: "cafe",
      imgUrl:
        "https://foodtracer.health.ntpc.gov.tw/WebUPD/foodtracer/FoodCompany/STARBUCKS-LOGO_22030310531630787.png",
    },

    {
      id: 13,
      name: "麥當勞",
      category: "fastfood",
      imgUrl:
        "https://yt3.googleusercontent.com/4x0sasEICqBRur_XCUDj1MoyAZJacz38i9m94pq0HgK91lZcxCCof0CakpCewIVucFWaAQ11=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 14,
      name: "麥當勞",
      category: "fastfood",
      imgUrl:
        "https://yt3.googleusercontent.com/4x0sasEICqBRur_XCUDj1MoyAZJacz38i9m94pq0HgK91lZcxCCof0CakpCewIVucFWaAQ11=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 15,
      name: "麥當勞",
      category: "fastfood",
      imgUrl:
        "https://yt3.googleusercontent.com/4x0sasEICqBRur_XCUDj1MoyAZJacz38i9m94pq0HgK91lZcxCCof0CakpCewIVucFWaAQ11=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      id: 16,
      name: "麥當勞",
      category: "fastfood",
      imgUrl:
        "https://yt3.googleusercontent.com/4x0sasEICqBRur_XCUDj1MoyAZJacz38i9m94pq0HgK91lZcxCCof0CakpCewIVucFWaAQ11=s900-c-k-c0x00ffffff-no-rj",
    },

    {
      id: 17,
      name: "meowxiang",
      category: "aroma",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ4l6sdCHQDlehjIKEI3KptGjXUmGm6cNa_A&s",
    },
    {
      id: 18,
      name: "meowxiang",
      category: "aroma",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ4l6sdCHQDlehjIKEI3KptGjXUmGm6cNa_A&s",
    },
    {
      id: 19,
      name: "meowxiang",
      category: "aroma",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ4l6sdCHQDlehjIKEI3KptGjXUmGm6cNa_A&s",
    },
    {
      id: 20,
      name: "meowxiang",
      category: "aroma",
      imgUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ4l6sdCHQDlehjIKEI3KptGjXUmGm6cNa_A&s",
    },
  ]);

  const currentCategory = ref('restaurant')  // 初始分類

  const changeCurrentCategory = (cat) => {
      // console.log('切換分類為：', cat)
    currentCategory.value = cat
  }

  const filteredBrands = computed(() => {
    return brands.value.filter((brand) => brand.category === currentCategory.value)
  })

  return { 
    brands,
    currentCategory,
    changeCurrentCategory,
    filteredBrands };
});
