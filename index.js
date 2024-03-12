import axios from "https://cdn.skypack.dev/axios";
let comments = [];
let currentUser = [];
async function fetchData() {
  try {
    const response = await axios.get("./data.json");
    const data = response.data;
    comments.push(data.comments);
    currentUser = data.currentUser;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  processComments(comments);
}
const screenWidth = window.innerWidth;
function processComments(comments) {
  const commentsContainer = document.getElementById("comments");
  const getReplies = JSON.parse(localStorage.getItem("replies")) || {};

  comments[0].map((e) => {
    if (Array.isArray(getReplies)) {
      const userWhoReplied = e.replies.map((res) => {
        const repliedUsers = res.user.username;
        return repliedUsers;
      });
      getReplies.map((rep) => {
        if (
          userWhoReplied.includes(rep.replyingTo) ||
          e.user.username === rep.replyingTo
        ) {
          e.replies.push(rep);
        }
      });
    }

    const comment = document.createElement("div");
    comment.classList.add("comments");
    comment.innerHTML = `
    <article  id="comment-${e.id}"  >
    <section class=commentSection>
   ${
     screenWidth > 770
       ? `<aside class=score>
    <span class="plus"data-comment-id="${e.id}" >+</span>
    <span class="scoreNumber">
    ${e.score}
    </span>
    <span class="minus"data-comment-id="${e.id}">-</span></aside>`
       : ""
   } 
     <div> 
      <div class=topCommentSection>     
      <div class=userInfo>
      <time class=createdAt>${e.createdAt}</time> 
      <div class=userName>${e.user.username}</div>     
      <img src=${e.user.image.png} alt="profile pic"/>
     </div>
     ${
       screenWidth > 770
         ? `<button class="replyBtn" data-comment-id="${e.id}" name=${e.user.username}><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg> Reply</button>`
         : ""
     }</div>                         

     <p class=content>${e.content}</p></div>
     ${
       screenWidth > 770
         ? ""
         : `
         <div class="scoreAndBtn">
         <aside class=score>
        <span class="plus"data-comment-id="${e.id}" >+</span>
        <span class="scoreNumber">
        ${e.score}
        </span>
        <span class="minus"data-comment-id="${e.id}">-</span></aside>
        <button class="replyBtn" data-comment-id="${e.id}" name="${e.user.username}"><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg> Reply</button>
        </div>
        `
     }
     </section>
   
     </article>
     ${
       e.replies
         ? `${e.replies.reduce((accumulator, rep) => {
             console.log(rep);
             return (
               accumulator +
               `
          <article id="comment-${rep.id}" class="reply">
              <section class="replies">
              ${
                screenWidth > 770
                  ? `                  
                  <aside class="score">
                      <span class="plus"data-comment-id="${rep.id}">+</span>
                      <span class="scoreNumber">${rep.score}</span>
                      <span class="minus"data-comment-id="${rep.id}">-</span>
                  </aside>`
                  : ""
              }
              <div class="commentAndDetails">
                  <header class="topCommentSection">
                  <div class="userInfo">
                      <time class="createdAt" datetime="${
                        isISODate(rep.createdAt) ? rep.createdAt : ""
                      }">
                          ${
                            isISODate(rep.createdAt)
                              ? calculateTimeDifference(rep.createdAt)
                              : rep.createdAt
                          }
                      </time>
                      <div class="userName">${
                        rep?.user?.username === "juliusomo"
                          ? `${rep?.user?.username} <span class="you">you</span>`
                          : rep?.user?.username
                      }
                      </div>
                      <img src="${rep.user?.image.png}" alt="profile pic" />
                  </div>
                  ${
                    screenWidth > 770
                      ? `${
                          rep.user.username === "juliusomo"
                            ? `
                              <div class="currentUserBtn">                            
                                  <button class="deleteBtn" data-reply-id="${rep.id}"><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>  Delete</button>
                                  <button class="editBtn" data-reply-id="${rep.id}"><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>  Edit</button>
                              </div>`
                            : `<button class="replyBtn" data-comment-id="${rep.id}"  name=${rep.user.username}><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>  Reply</button>`
                        }`
                      : ""
                  }
                  </header>
                  <p class="content"><span class="relpyTo">@${
                    rep.replyingTo
                  }</span>${rep.content}</p>
              </div>
              ${
                screenWidth < 770
                  ? `
                  <div class="scoreAndBtn">
                      <aside class="score">
                      <span class="plus"data-comment-id="${rep.id}">+</span>
                      <span class="scoreNumber">${rep.score}</span>
                      <span class="minus" data-comment-id="${rep.id}">-</span>
                      </aside>
                      ${
                        rep.user.username === "juliusomo"
                          ? `
                      <div class="currentUserBtn">                            
                          <button class="deleteBtn" data-reply-id="${rep.id}"><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>  Delete</button>
                          <button class="editBtn" data-reply-id="${rep.id}" name="${rep.user.username}"><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>  Edit</button>
                      </div>
                      </div>`
                          : `<button class="replyBtn"  data-comment-id="${rep.id}" name="${rep.user.username}"><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>  Reply</button>`
                      }`
                  : ""
              }
              </section>
          </article>`
             );
           }, "")}
      `
         : ""
     }
    
     `;
    commentsContainer.append(comment);
  });
  const replyButtons = document.querySelectorAll(".replyBtn");
  replyButtons.forEach((button) => {
    button.addEventListener("click", (event) =>
      handleReplyButtonClick(event, currentUser)
    );
  });
  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => handleDeleteButtonClick(event));
  });
  const editButtons = document.querySelectorAll(".editBtn");
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEditButtonClick);
  });

  const scoreButtons = document.querySelectorAll(".plus, .minus");
  scoreButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleScore(event, button);
    });
  });
  // commentsContainer.addEventListener("click", (event) => {
  //   const target = event.target;
  //   if (target.classList.contains("replyBtn")) {
  //     handleReplyButtonClick(event, currentUser);
  //   }
  // });
}
function isISODate(dateString) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return isoDateRegex.test(dateString);
}
function handleReplyButtonClick(event, currentUser) {
  const clickedBtn = event.currentTarget;
  const commentId = clickedBtn.dataset.commentId;
  const replyTo = event.target.name;

  if (!commentId) {
    console.error("Invalid comment ID:", commentId);
    return;
  }

  const userInfo = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: currentUser.username,
    image: currentUser.image.png,
  };

  console.log(userInfo);

  const parentContainer = document.getElementById(`comment-${commentId}`);

  if (!parentContainer) {
    console.error(`Parent container not found for comment ID: ${commentId}`);
    return;
  }

  const existingReplyInput = parentContainer.querySelector(".reply-input");

  if (!existingReplyInput) {
    const replyUser = `
      <div class="currentUserReply">
        <img src="${currentUser.image.png}" alt="profile pic"/>
        <textarea placeholder="Add a comment..." class="reply-input">@${replyTo} </textarea>
        <button class="replyBtn">SEND</button>
      </div>
    `;

    const replyContainer = document.createElement("div");
    replyContainer.innerHTML = replyUser;

    const replyInput = replyContainer.querySelector(".reply-input");
    const replyBtn = replyContainer.querySelector(".replyBtn");

    replyBtn.addEventListener("click", () => {
      const replyContent = replyInput.value.trim();
      if (replyContent) {
        appendReply(commentId, userInfo, replyContent, replyTo);
        replyInput.value = "";
        replyContainer.remove();
      } else {
        alert("Please enter a reply.");
      }
    });

    parentContainer.appendChild(replyContainer);
    console.log("Reply container appended to parent:", parentContainer);
  }
}
function appendReply(commentId, userInfo, replyContent, replyTo) {
  const parentContainer = document.getElementById(`comment-${commentId}`);
  const userReply = document.createElement("div");

  const createdAt = new Date();

  userReply.innerHTML = `
    <article id="comment-${userInfo.id}"  >
      <section class=replies >
      ${
        screenWidth > 770
          ? `      <div class=score><span class=plus>+</span>
        <span class=scoreNumber>
          0</span>
        <span class=minus>-</span></div>`
          : ""
      }
        <div> 
        <div class=topCommentSection>
        <div class=userInfo>
        <div class=createdAt>Just Now</div>
        <div class=userName>${userInfo.username}</div>
        <img src=${userInfo.image}  alt="profile pic"/>
        </div>
        ${
          screenWidth > 770
            ? `      
            <div class="currentUserBtn">                            
              <button class="deleteBtn" data-reply-id="${userInfo.id}" ><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>  Delete</button>
              <button class="editBtn" data-reply-id="${userInfo.id}" ><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>  Edit</button>
            </div>`
            : ``
        }
        </div>
        <p class="content"><span class=relpyTo >@${replyTo}</span> ${
    replyContent.includes(`@${replyTo}`)
      ? replyContent.replace(`@${replyTo}`, "")
      : ""
  }</p>
        ${
          screenWidth > 770
            ? ``
            : `<div class="scoreAndBtn">
        <div class=score><span class=plus>+</span>
        <span class=scoreNumber>
          0</span>
        <span class=minus>-</span></div>
        <div class="currentUserBtn">                            
        <button class="deleteBtn" data-reply-id="${userInfo.id}"><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>  Delete</button>
        <button class="editBtn" data-reply-id="${userInfo.id}"><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>  Edit</button>
        </div>
          </div>
        `
        }
        </div>
      </section> 
    </article>
  `;
  parentContainer.append(userReply);

  const storedReplies = JSON.parse(localStorage.getItem("replies")) || [];
  const replyId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  storedReplies.push({
    id: replyId,
    content: `${
      replyContent.includes(`@${replyTo}`)
        ? replyContent.replace(`@${replyTo}`, "")
        : ""
    }`,
    createdAt: createdAt,
    score: 0,
    replyingTo: replyTo,
    user: {
      image: {
        png: userInfo.image,
      },
      username: userInfo.username,
    },
  });
  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => handleDeleteButtonClick(event));
  });
  const editButtons = parentContainer.querySelectorAll(".editBtn");
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEditButtonClick);
  });
  localStorage.setItem("replies", JSON.stringify(storedReplies));
}
function calculateTimeDifference(createdAt) {
  const currentDate = new Date();
  const seconds = Math.floor((currentDate - new Date(createdAt)) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

const userReplyScores = {};

function handleScore(event, scoreButton) {
  const clickedBtn = event.currentTarget;
  const commentId = clickedBtn.dataset.commentId;

  const scoreElement = document.querySelector(
    `#comment-${commentId} .scoreNumber`
  );

  if (!scoreElement) {
    console.error(`Score element not found for comment with ID ${commentId}`);
    return;
  }

  let currentScore = parseInt(scoreElement.textContent);

  const action = scoreButton.classList.contains("plus") ? "plus" : "minus";

  if (
    currentScore === 0 &&
    ((action === "minus" && currentScore === -1) ||
      (action === "plus" && currentScore === 1))
  ) {
    return;
  }

  const userId = currentUser.username;
  console.log(userId);
  if (
    userReplyScores.hasOwnProperty(userId) &&
    userReplyScores[userId].hasOwnProperty(commentId)
  ) {
    const previousScore = userReplyScores[userId][commentId];

    if (clickedBtn.disabled) {
      console.log("Button already disabled");
      return;
    }

    if (clickedBtn.classList.contains("plus")) {
      if (previousScore !== "plus") {
        currentScore += 1;
        userReplyScores[userId][commentId] = "plus";
      }
    } else if (clickedBtn.classList.contains("minus")) {
      if (previousScore !== "minus") {
        currentScore = Math.max(0, currentScore - 1);
        userReplyScores[userId][commentId] = "minus";
      }
    }
  } else {
    if (!userReplyScores.hasOwnProperty(userId)) {
      userReplyScores[userId] = {};
    }
    userReplyScores[userId][commentId] = null;

    if (clickedBtn.classList.contains("plus")) {
      currentScore += 1;
      userReplyScores[userId][commentId] = "plus";
    } else if (clickedBtn.classList.contains("minus")) {
      currentScore = Math.max(0, currentScore - 1);
      userReplyScores[userId][commentId] = "minus";
    }
  }

  scoreElement.textContent = currentScore;
}

function handleDeleteButtonClick(event) {
  const clickedBtn = event.currentTarget;
  const replyId = clickedBtn.dataset.replyId;
  console.log(replyId);
  console.log("Clicked Button:", clickedBtn);
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const confirmation = document.createElement("div");
  confirmation.classList.add("confirmation");
  confirmation.innerHTML = `
    <h2>Delete Comment</h2>
    <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
    <div>
      <button class="cancel">NO, CANCEL</button>
      <button class="delete">YES, DELETE</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(confirmation);

  const deleteBtn = confirmation.querySelector(".delete");
  const cancelBtn = confirmation.querySelector(".cancel");

  deleteBtn.addEventListener("click", () => {
    const replyElement = document.getElementById(`comment-${replyId}`);
    console.log(replyElement);
    if (replyElement) {
      replyElement.remove();
    }

    let storedReplies = JSON.parse(localStorage.getItem("replies")) || [];
    storedReplies = storedReplies.filter((reply) => reply.id !== replyId);
    localStorage.setItem("replies", JSON.stringify(storedReplies));

    overlay.remove();
    confirmation.remove();
  });

  cancelBtn.addEventListener("click", () => {
    overlay.remove();
    confirmation.remove();
  });
}

function handleEditButtonClick(event) {
  const clickedBtn = event.currentTarget;
  const replyId = clickedBtn.dataset.replyId;
  const editButtons = document.querySelectorAll(".editBtn");
  editButtons.forEach((button) => {
    button.disabled = true;
    button.classList.add("disabledEditBtn");
    const path = button.querySelector("svg path");
    path.setAttribute("fill", "#cecce9");
  });

  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach((button) => {
    button.disabled = true;
    const path = button.querySelector("svg path");
    path.setAttribute("fill", "#f6d2d2");
    button.classList.add("disabledDeleteBtn");
  });
  const replyElement = document.getElementById(`comment-${replyId}`);
  console.log(replyElement);
  replyElement.classList.add("disabled");
  const contentElement = replyElement.querySelector(".content");
  const replyContent = contentElement.textContent;

  contentElement.innerHTML = `
    <textarea class="editReply-input">${replyContent}</textarea>
    <div>
    <button class="confirmEditBtn">Update</button>
  `;

  const confirmEditBtn = replyElement.querySelector(".confirmEditBtn");
  confirmEditBtn.addEventListener("click", () => {
    const updatedReplyContent =
      replyElement.querySelector(".editReply-input").value;

    contentElement.textContent = updatedReplyContent;

    editButtons.forEach((button) => {
      button.disabled = false;
      const path = button.querySelector("svg path");
      path.setAttribute("fill", "#5357B6");
      button.classList.remove("disabledEditBtn");
    });

    deleteButtons.forEach((button) => {
      const path = button.querySelector("svg path");
      path.setAttribute("fill", "#ED6368");
      button.disabled = false;
      button.classList.remove("disabledDeleteBtn");
    });
  });
}

fetchData();
