const state = {
    purchasedProductIds: JSON.parse(localStorage.getItem("productIds")) || [],
    products: []
}

$(document).ready(async function() {
    await initialProducts()
    buildViewProducts()

    $("#search_submit").click(() => {
        const trackNumber = $("#search_input").val();
        track(trackNumber)
    })

})

async function initialProducts(){
    await $.ajax({
        url: "/products",
        method: "GET"
      }).done(function(products) {
          state.products = products
      });
}

function buildViewProducts() {
    const html = state.products.reduce((html, product)=>html+buildViewProduct(product), '<div>')+'</div>'
    $("#products_list").html(html)
}

function buildViewProduct(product) {
    return `<ul>
                <img src="${product.img}" border="0" alt="" class="prodImg">
                <li> Name: ${product.name}</li>
                <li>Price: ${product.price}</li>
                ${state.purchasedProductIds.some(purchasedProduct=>purchasedProduct.productId == product.productId)?
                    `<button class="track_button" id="${product.id}" onclick="track(${product.id})">track</button>`:
                    `<button class="buy_button" id="${product.id}" onclick="buyItem(${product.id})">Buy</button>`
                }
                
            </ul>`
}

async function buyItem(productId){

    console.log("Buy function: "+productId)
    const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
    if(productIds.find(purchase => purchase.productId == productId)) {
        console.log("Нou already bought this item: "+productId  )
    }
    else {
        productIds.push({productId, time: new Date()})
        localStorage.setItem("productIds",JSON.stringify(productIds))
        state.purchasedProductIds = productIds
        $(`button#${productId}`)
            .prop("onclick", "")
            .removeClass("buy_button")
            .addClass("track_button")
            .text("track")
            .click(()=>track(productId))
    }
}

async function track(productId) {
    let product = JSON.parse(localStorage.getItem("productIds")).find(product => product.productId == productId);
    console.log("track function: "+product.productId)
    $("#modal_header").html(`<h3>Tracking package: #${product.productId}</h3><h5>was bought at ${product.time}</h5>`)
    modal.style.display = "block";
}
