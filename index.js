document.addEventListener("DOMContentLoaded", function () {
  //api endpoints
  const sourceURL = "https://valorant-api.com/v1/agents/";
  const url = sourceURL;

  //check document use ajax
  $(document).ready(() => {
    getValoData();
  });
  let valoData;
  function getValoData() {
    $.ajax({
      url,
      type: "GET",
      success: (data) => {
        console.log(data);
        printData(data);
        valoData = data;
        animateHeader(header);
        animateCharacterCards();
      },
      error: (err) => console.log(err),
    });
  }

  //main html elements
  $("body").append("<div class='container'></div>");
  const header = "VALORANT AGENTS";
  $(".container").append(
    `<div class='container-header'><h1 class='headline'></h1></div>`
  );
  $(".container-header").append(
    `<video playsinline autoplay muted loop id="bgvideo" width="100%" height="auto">
    <source src="./img/valorant_video.mp4" type="video/mp4">
    </video>`
  );
  $(".container-header").after("<div class='cards'></div>");

  // creating the cards of the characters
  function printData(data) {
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].isPlayableCharacter === true) {
        let agentName = data.data[i].displayName;
        let picUrl = data.data[i].fullPortraitV2;
        let card = `<div class="card-${i} character">
      
      <div class='agentName-container'><h2 class='charName'>${agentName}</h2></div>
      <img src="${picUrl}" alt="${agentName}"/>
    </div>`;

        $(".cards").append(card);
      }
      if (i <= 9) {
        $(`.card-${i}`).append(`<p class='valoIndex'>0${i + 1}</p>`);
      } else {
        $(`.card-${i}`).append(`<p class='valoIndex'>${i + 1}</p>`);
      }
    }
  }

  // valorant header animation
  function animateHeader(header) {
    const chars = header.split("");

    chars.forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      document.querySelector(".headline").appendChild(span);
    });

    const spanChars = document.querySelectorAll("span");

    const tl2 = gsap.timeline({
      repeat: -1,
      onCompleteAll: () => {
        tl2.restart();
      },
    });

    spanChars.forEach((span, i) => {
      // skip the empty span
      if (span.textContent !== " ") {
        tl2.to(span, {
          duration: 1,
          color: "#ff2851",
          ease: "easeInOut",
        });

        // Reverse set back to green
        tl2.to(span, {
          duration: 0.5,
          color: "#c7f458ff",
          ease: "easeIn",
        });
      }
    });
  }

  let selectedCard = null;

  function animateCharacterCards() {
    const characterCards = document.querySelectorAll(".character");

    characterCards.forEach((card, i) => {
      const tl = gsap.timeline({
        delay: i * 0.25,
      });

      tl.from(card, {
        duration: 2,
        scale: 0,
        y: 40,
        ease: "power3.inOut",
      });
      card.addEventListener("click", () => {
        const tlCard = gsap.timeline({
          delay: 0.25,
        });
        const tlCardColor = gsap.timeline({
          delay: 0.25,
        });

        let bgUrl = valoData.data[i].background;
        card.style.backgroundImage = `linear-gradient(90deg, rgba(199, 244, 88, 0.75) 0%, rgba(58, 38, 86, 0.75) 40%, rgba(58, 38, 86, 0.75) 60%, rgba(199, 244, 88, 0.75) 100%), url("${bgUrl}")`;

        if (selectedCard) {
          selectedCard.style.backgroundImage = "";
          tlCard.to(selectedCard, {
            duration: 0.5,
            scale: 1,
            ease: "power3.out",
            borderColor: "",
            borderWidth: "",
          });

          const agentNumber = selectedCard.querySelector(".valoIndex");
          tlCardColor.to(agentNumber, {
            color: "",
          });
          const characterName = card.querySelector(".charName");
          tlCardColor.to(characterName, {
            transform: "rotate(0deg)",
            duration: 0.75,
          });
          tlCardColor.to(characterName, {
            textShadow:
              "0px 30px 0px #fff, 0px 60px 0px #fffccc, 0px 90px 0px #fffaaa, 0px 120px 0px #222333",
            duration: 1.5,
          });
        }

        const agentNumber = card.querySelector(".valoIndex");
        tlCardColor.to(agentNumber, {
          color: "#3a2656ff",
        });

        tlCard.to(card, {
          duration: 0.5,
          scale: 1.2,
          ease: "power3.out",
          borderColor: "#00bdbd",
          borderWidth: "3px",
        });

        selectedCard = card;
      });
    });
  }
});
