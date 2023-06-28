const jobsaboardAPI = document.querySelector(".job-card");
const searchAPI = document.querySelector("#search");
let usersMap = new Map(); // Use Map instead of an array

searchAPI.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();

  usersMap.forEach((user, id) => {
    const isVisible = user.titleOcup.toLowerCase().includes(searchValue);

    const element = document.getElementById(id);
    if (element) {
      element.style.display = isVisible ? "block" : "none";
    }
  });
});

const fetchJobs = async () => {
  let page = 1;
  const resultsPerPage = 500;

  while (usersMap.size < 500) {
    // Desired number of results
    const response = await fetch(
      `http://api.adzuna.com:80/v1/api/jobs/gb/search/${page}?app_id=85bcc4a9&app_key=7deaedc76d4bef0b821c3b584be2f74e&results_per_page=${resultsPerPage}&what=%20junior%20graduate&content-type=application/json`
    );

    const data = await response.json();
    const job = data.results;

    if (job.length === 0) {
      // No more results available
      break;
    }

    job.forEach((user) => {
      const titleOcup = user.title;
      const companyName = user.company.display_name;
      const createDate = new Date(user.created).toLocaleDateString();
      const salary = user.salary_max;
      const salary_min = user.salary_min;
      const UkLocation = user.location.area[0];
      const UkCity = user.location.area[1];
      const urlDirect = user.redirect_url;

      const element = document.createElement("div");
      element.id = `job-card-${usersMap.size + 1}`; // Set unique ID for each job card
      element.classList.add("job-card");

      const html = `
        <divid="job-card" class="row align-items-center col-sm-9 mx-auto">
          <div class="col-sm-12 mx-auto">
            <div class="card shadow border">
              <div class="card-body justify-content-between">
                <h5 class="card-title d-flex">${titleOcup}</h5>
                <p class="card-text">Date: ${createDate}</p>
                <p class="card-text mb-10">Company Name: ${companyName}</p>
                <p class="card-text mb-10">Location: ${UkLocation}</p>
                <p class="card-text mb-10">Location: ${UkCity}</p>
                <p><h4><span class="badge badge-primary float-left">Salary-Max: £${salary}</span></h4></p>
                <br>
                <p><h4><span class="badge badge-info float-left">Salary-Min: £${salary_min}</span></h4></p>
                <br>
                <br>
                <a onclick="window.open('${urlDirect}')" class="btn btn-primary text-white">Apply Now</a>
              </div>
            </div>
          </div>
        </div>`;

      element.innerHTML = html;
      jobsaboardAPI.appendChild(element);

      usersMap.set(element.id, {
        element,
        titleOcup,
        createDate,
        companyName,
        UkLocation,
        UkCity,
        salary,
        salary_min,
        urlDirect,
      });
    });

    page++;
  }

  console.log(usersMap);
};

fetchJobs();
