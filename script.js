const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex" //qnd clicar no botao, muda de hidden para flex e abre "meu carrinho"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {  //se clicar na parte do cartModal (fora do meu carrinho) ele fecha a aba "meu carrinho"
        cartModal.style.display = "none"
    }
})

// Clicar o botão de "Fechar"
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

// Clicar no botão de add item no carrinho
menu.addEventListener("click", function(event) {
    let parenButton = event.target.closest(".add-to-cart-btn") // . pq ele quer achar a classe

    if(parenButton) {
        const name = parenButton.getAttribute("data-name")
        const price = parseFloat(parenButton.getAttribute("data-price"))

        // Adicionar no carrinho 
        addToCart(name, price)
    }
})

// Função para add no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if(existingItem) {
        // Se o item já existe aumenta apenas a quantidade
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    Toastify({
        text: "Item adicionado no carrinho!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "",
        },
        onClick: function(){} // Callback after click
    }).showToast();

    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0; // Adiciona uma variável para contar o total de itens
  
    cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
  
      cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p> Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
            </button>
        </div>
      `

      total += item.price * item.quantity;
      totalItems += item.quantity; // Atualiza o total de itens
  
      cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.textContent = totalItems; // Atualiza o contador com o número total de itens
}

// Função para remover o item do carrinho 
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

// Remover itens do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

// Monitora o input de endereço
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar o pedido
checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestauranteOpen();

    if(!isOpen) {
        Toastify({
            text: "Restaurante Fechado!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Enviar pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems);
    const phone = "13996238737";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
})

// Verificar a hora e manipular o card horário
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen()

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
