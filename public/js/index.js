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
                ${state.purchasedProductIds.some(purchasedProduct=>purchasedProduct.productId == product.id)?
                    `<button class="track_button" id="product_${product.id}" onclick="track(${product.id})">track</button>`:
                    `<button class="buy_button" id="product_${product.id}" onclick="buyItem(${product.id})">Buy</button>`
                }
                
            </ul>`
}

async function buyItem(productId){

    console.log("Buy function: "+productId)
    const productIds = JSON.parse(localStorage.getItem("productIds")) || [];
    if(productIds.find(purchase => purchase.productId == productId)) {
        alert("Нou already bought this item: "+productId  )
    }
    else {
        productIds.push({productId, time: new Date()})
        localStorage.setItem("productIds",JSON.stringify(productIds))
        state.purchasedProductIds = productIds
        $(`button#product_${productId}`)
            .text("track")
            .prop("onclick", "")
            .removeClass("buy_button")
            .addClass("track_button")
            .click(()=>track(productId))
    }
}

async function track(productId) {
    let product = JSON.parse(localStorage.getItem("productIds")).find(product => product.productId == productId);
    if(product){
        let time = moment(product.time).fromNow();
        let secondsDiff = parseInt(moment().diff(product.time)/1000)
        let minutesDiff = parseInt(secondsDiff/60)
        console.log("secondsDiff: "+secondsDiff)
        console.log("minutesDiff: "+minutesDiff)
        console.log("track function: "+product.productId)
        $("#modal_header").html(`Tracking package: #${product.productId}`)
        $("#modal_time_ago").html(`<h5>was bought ${time}</h5>`)
        
        $("#dect_1").html( (minutesDiff >= 1 ? "V" : "O") + " - exit from store")
        $("#dect_2").html( (minutesDiff >= 2 ? "V" : "O") + " - in the store port")
        $("#dect_3").html( (minutesDiff >= 3 ? "V" : "O") + " - in the sea")
        $("#dect_4").html( (minutesDiff >= 4 ? "V" : "O") + " - in your country port")
        $("#dect_4").html( (minutesDiff >= 5 ? "V" : "O") + " - The package is on way to you :)")
        
        modal.style.display = "block";
    }
    else {
        alert("Error: product not found.")
    }
    
}
