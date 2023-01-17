const axios = window.axios;
let form = {};
const dropArea = document.querySelector(".drag-area"),
  jobDes = document.querySelector("#job-des"),
  submitBtn = document.querySelector("#submit"),
  uploadIcon = dropArea.querySelector("#upload-icon"),
  fileIcon = dropArea.querySelector("#file-icon"),
  fileName = dropArea.querySelector("#fileName"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  containers = document.querySelectorAll(".tab-box"),
  result = document.querySelector("#result"),
  input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
submitBtn.onclick = () => {
  fetchSomething(); //if user click on the button then the input also clicked
};
dropArea.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};
input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});

function showFile() {
  let fileType = file.type; //getting selected file type //adding some valid image extensions in array
  if (fileType.includes("pdf")) {
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = () => {
      let fileURL = fileReader.result; //passing user file source in fileURL variable
      console.log({ fileURL, file });
      form.cv = file;
      fileIcon.style.display = "block";
      uploadIcon.style.display = "none";
      fileName.style.display = "block";
      fileName.innerHTML = file.name;
      dragText.textContent = "Drag & Drop to Change File";
      //adding that created img tag inside dropArea container
    };
    fileReader.readAsDataURL(file);
  } else {
    alert("Unsupported file type");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}
const fetchSomething = async () => {
  containers[0].style.display = "block";
  containers[1].style.display = "none";
  containers[2].style.display = "none";
  form.job = jobDes.value;
  let formData = new FormData();
  console.log({ form });
  formData.append("role", form.job);
  formData.append("cv", form.cv);
  submitBtn.innerHTML = "Submitting";

  await axios
    .post(url, formData)
    .then(({ data }) => {
      console.log({ data });
      console.log({ datad: data.data.coverLetter });
      result.innerHTML = data.data.coverLetter;
      containers[0].style.display = "none";
      containers[1].style.display = "block";
      containers[2].style.display = "none";

      submitBtn.innerHTML = "Submited";
      this.form = {};
      new Promise((resolve) =>
        setTimeout(resolve, 2000)
      ).then((data) => {
        submitBtn.innerHTML = "Generate Cover Letter";
      });
    })
    .catch((e) => {
      console.log({ e });

      form = {};
      new Promise((resolve) =>
        setTimeout(resolve, 2000)
      ).then((data) => {
        containers[0].style.display = "none";
        containers[1].style.display = "none";
        containers[2].style.display = "block";
        submitBtn.innerHTML = "Generate Cover Letter";
      });
    });
};
const copyLetterBtn = document.querySelector("#copy-letter"),
  saveLetterBtn = document.querySelector(".save-letter");
copyLetterBtn.addEventListener("click", copyLetter);

function copyLetter() {
  navigator.clipboard.writeText(result.innerHTML);
  alert("Copied");
}