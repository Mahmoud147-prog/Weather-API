


let find_btn = document.querySelector('#find_btn');
let location_input = document.querySelector('#location');
let q_param
//active class adding
let anchor_group = document.querySelector('#anchores_div');
let single_anchors_nodelist = document.querySelectorAll('.anchor');
let single_anchors_arr = Array.from(single_anchors_nodelist)

for (let i = 0; i < single_anchors_arr.length; i++) {
  single_anchors_arr[i].addEventListener('click', function (e) {
    e.preventDefault()
    let current = document.querySelector(".active");
    
    current.classList.remove('active');
    this.classList.add('active');
  })
}

//fetching process

let base_URL = 'http://api.weatherapi.com/v1/forecast.json?';
let API_key = '44c045301fd349b5909215917240607';
let days_num = 3;
//using button (enter)
location_input.addEventListener('change',function(){
  q_param = location_input.value;
  get_json()
})

location_input.addEventListener('keypress',function(e){
  
  if(e.key==="Enter"){
    e.preventDefault()
    q_param = location_input.value;
    get_json();
  }
})


//using button (find)
find_btn.addEventListener('click', function () {
  q_param = location_input.value;
  get_json()
})
async function get_json() {

  try {
     document.querySelector('#spinner_div').innerHTML=`<span class="loader"></span>`
    let respond = await fetch(`${base_URL}&key=${API_key}&q=${q_param}&days=${days_num}`);
    let json_response = await respond.json();
    console.log(json_response)
    display( json_response)
    
  }
  catch  {
    Swal.fire({
      title: "please enter a valid value",
      showClass: {
        popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
      },
      hideClass: {
        popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
      }
    });
  }
}
//display function
function display( data){
  let dataArray = data.forecast.forecastday
  const date = new Date(dataArray[0].date)
  // day name
  let current_day=document.querySelector('#current_day')
  const weekDay = date.toLocaleDateString("us-uk", { weekday: "long" })
  current_day.innerHTML=weekDay;
  //day number and month
  const day_num_month = date.toLocaleDateString("us-uk", { month:'long',day:'2-digit'})
  let current_num_month=document.querySelector('#current_num_month')
  current_num_month.innerHTML=day_num_month
  //spcial div content
  let special_div=document.querySelector('.my_special_div');
  let special_div_box=`
  <p class="special_color">${data.location.name}</p>
              <h1 class="text-white">${dataArray[0].day.maxtemp_c}</h1>
              <img src='https:${dataArray[0].day.condition.icon}'></img>
              <p class="light_blue">${dataArray[0].day.condition.text}</p>
              <div class="d-flex">
                <div class="d-flex  me-2">
                  <img src="images/icon-umberella@2x.png" alt="">
                  <p class="special_color">${dataArray[0].day.daily_chance_of_rain}%</p>
                </div>
                <div class="d-flex me-2">
                  <img src="images/icon-wind@2x.png" alt="">
                  <p class="special_color">${dataArray[0].day.maxwind_kph}km/h</p>
                </div>
                <div class="d-flex me-2">
                  <img src="images/icon-compass@2x.png" alt="">
                  <p class="special_color">east</p>
                </div>
              </div>
  `
special_div.innerHTML=special_div_box
//other 2 days forecasting
for(let i=1;i<3;i++){
  const coming_date = new Date(dataArray[i].date)
  const weekDay = coming_date.toLocaleDateString("us-uk", { weekday: "long" })
  let ele=document.querySelector(`#nextday_${i}`)
  ele.innerHTML=weekDay;

  let larger_ele=document.querySelector(`#my_own_div_${i}`)
  let larger_ele_box=`
  <img src="https:${dataArray[i].day.condition.icon}" alt="">
              <p class="fs-2 text-white">${dataArray[i].day.maxtemp_c}</p>
              <p class="fs-4 class_my_gray">${dataArray[i].day.mintemp_c}</p>
              <p class="light_blue"> ${dataArray[i].day.condition.text}</p>
  `
  larger_ele.innerHTML=larger_ele_box
}
  
}
// displaying current position
function show_position(position){
  let latitude=position.coords.latitude
  let longitude=position.coords.longitude
  let location=`${latitude},${longitude}`
  q_param=location
  get_json()
}

function get_geolocation(){
  navigator.geolocation.getCurrentPosition(show_position)
}
get_geolocation()
