const verses=[
{text:"I can do all things through Christ who strengthens me.",ref:"Philippians 4:13"},
{text:"The Lord is my strength and my shield; my heart trusts in him, and he helps me.",ref:"Psalm 28:7"},
{text:"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",ref:"Joshua 1:9"},
{text:"Cast all your anxiety on him because he cares for you.",ref:"1 Peter 5:7"},
{text:"For God gave us a spirit not of fear but of power and love and self-control.",ref:"2 Timothy 1:7"},
{text:"Let all that you do be done in love.",ref:"1 Corinthians 16:14"}
];
const affirmations=[
"I am worthy of grace, even while I am growing.",
"I can begin before I feel completely ready.",
"My worth is not measured by my productivity.",
"I am capable of learning from yesterday without living in it.",
"Small progress is still progress.",
"I choose courage over the fear of getting it wrong."
];
const quotes=[
"You don't have to conquer the whole mountain today. Just take the next faithful step.",
"Small progress is still progress. Give yourself permission to begin imperfectly.",
"You are allowed to rest without calling yourself lazy.",
"Your worth is not measured by how much you accomplish.",
"Start where you are. Trust God with what comes next.",
"You can begin again. Today is not asking you to be perfect."
];
const $=id=>document.getElementById(id);
const random=list=>list[Math.floor(Math.random()*list.length)];
let currentVerse,currentAffirmation;

function showVerse(){
 currentVerse=random(verses);$("verseText").textContent=`"${currentVerse.text}"`;$("verseReference").textContent=`— ${currentVerse.ref}`;
}
function showAffirmation(){currentAffirmation=random(affirmations);$("affirmationText").textContent=currentAffirmation}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function copy(text){navigator.clipboard?.writeText(text).then(()=>toast("Copied to your clipboard ✦")).catch(()=>toast("Select and copy the text manually."))}
function setDate(){
 const d=new Date();$("todayDate").textContent=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});$("year").textContent=d.getFullYear()
}
showVerse();showAffirmation();setDate();

$("newVerse").onclick=showVerse;$("newAffirmation").onclick=showAffirmation;
$("copyVerse").onclick=()=>copy(`"${currentVerse.text}" — ${currentVerse.ref}`);
$("copyAffirmation").onclick=()=>copy(currentAffirmation);

["saveVerse","saveAffirmation"].forEach(id=>{
 $(id).onclick=()=>{ $(id).classList.toggle("saved"); $(id).textContent=$(id).classList.contains("saved")?"♥":"♡"; toast($(id).classList.contains("saved")?"Saved to this device ♥":"Removed from saved items"); };
});

document.querySelectorAll(".affirmation-tile").forEach(tile=>{
 tile.onclick=()=>{
  document.querySelectorAll(".affirmation-tile").forEach(t=>t.classList.remove("active"));
  tile.classList.add("active");currentAffirmation=tile.textContent;$("affirmationText").textContent=currentAffirmation;
  $("selectedNote").textContent="Your focus for today: “"+tile.textContent+"”";toast("Your daily affirmation has been set ✦");
  document.querySelector("#daily").scrollIntoView({behavior:"smooth"});
 };
});
$("newQuote").onclick=()=>{$("quoteText").textContent=random(quotes);toast("A new reminder for you ✦")};

const savedStep=localStorage.getItem("graceGrowthStep");
if(savedStep===new Date().toDateString()){$("checkinTitle").textContent="You took a step today. Be proud of that.";$("checkinBtn").textContent="Done ✦"}
$("checkinBtn").onclick=()=>{localStorage.setItem("graceGrowthStep",new Date().toDateString());$("checkinTitle").textContent="You took a step today. Be proud of that."; $("checkinBtn").textContent="Done ✦";toast("Every small step counts. Keep going. ✦")};

const menu=$(".menu-btn"),links=$(".nav-links");
menu.onclick=()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",open)};
document.querySelectorAll(".nav-links a").forEach(a=>a.onclick=()=>links.classList.remove("open"));

const storedTheme=localStorage.getItem("graceGrowthTheme");
if(storedTheme==="dark")document.documentElement.dataset.theme="dark";
$("themeBtn").onclick=()=>{
 const dark=document.documentElement.dataset.theme==="dark";
 if(dark){delete document.documentElement.dataset.theme;localStorage.setItem("graceGrowthTheme","light");$("themeBtn").textContent="☾"}
 else{document.documentElement.dataset.theme="dark";localStorage.setItem("graceGrowthTheme","dark");$("themeBtn").textContent="☀"}
};
if(document.documentElement.dataset.theme==="dark")$("themeBtn").textContent="☀";
