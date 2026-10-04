const questions=[
 {q:"أي من التالي يُعد عنصرًا من عناصر الوسائط المتعددة؟",a:["النصوص","الطابعة فقط","لوحة المفاتيح فقط","نظام التشغيل فقط"],c:0},
 {q:"ما الذي يجمع النص والصورة والصوت والفيديو في تجربة واحدة؟",a:["الوسائط المتعددة","معالج النصوص","الشبكة فقط","قاعدة البيانات"],c:0},
 {q:"ما فائدة اختبار النفس بعد المذاكرة؟",a:["قياس الفهم وتحديد ما يحتاج مراجعة","إلغاء المذاكرة","زيادة عدد الصفحات","حذف المعلومات"],c:0},
 {q:"أي عنصر يمكن أن يعرض حركة داخل العرض؟",a:["الرسوم المتحركة","النص الثابت فقط","الملف النصي فقط","اسم المستخدم"],c:0},
 {q:"ما أفضل تسلسل للمذاكرة في هذه المنصة؟",a:["تعلم ثم فهم ثم اختبار ثم مراجعة","اختبار ثم إغلاق الكتاب دائمًا","مراجعة دون تعلم","حفظ الإجابات فقط"],c:0}
];

let quizIndex=0,score=0,selected=null;
const $=id=>document.getElementById(id);

function showSection(id){
 document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
 document.querySelector("#"+id).classList.add("active");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
 window.scrollTo({top:0,behavior:"smooth"});
 if(id==="quiz") startQuiz();
 if(id==="progress") updateProgress();
}
document.querySelectorAll("[data-section]").forEach(b=>b.onclick=()=>showSection(b.dataset.section));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showSection(b.dataset.go));

function startQuiz(){
 quizIndex=0;score=0;selected=null;
 $("quizBox").classList.remove("hidden");$("result").classList.add("hidden");
 renderQuestion();
}
function renderQuestion(){
 const q=questions[quizIndex]; selected=null;
 $("qCount").textContent=`السؤال ${quizIndex+1} من ${questions.length}`;
 $("scoreLive").textContent=`الدرجة: ${score}`;
 $("question").textContent=q.q;
 const box=$("answers");box.innerHTML="";
 q.a.forEach((text,i)=>{
   const btn=document.createElement("button");btn.className="answer";btn.textContent=text;
   btn.onclick=()=>selectAnswer(i,btn);box.appendChild(btn);
 });
 $("nextBtn").disabled=true;
}
function selectAnswer(i,btn){
 if(selected!==null)return; selected=i;
 document.querySelectorAll(".answer").forEach(x=>x.disabled=true);
 btn.classList.add(i===questions[quizIndex].c?"correct":"wrong");
 if(i===questions[quizIndex].c)score++;
 $("nextBtn").disabled=false;
 $("scoreLive").textContent=`الدرجة: ${score}`;
}
$("nextBtn").onclick=()=>{
 if(quizIndex<questions.length-1){quizIndex++;renderQuestion();}
 else finishQuiz();
};
function finishQuiz(){
 const pct=Math.round(score/questions.length*100);
 const oldBest=Number(localStorage.getItem("bestScore")||0);
 localStorage.setItem("bestScore",Math.max(oldBest,pct));
 localStorage.setItem("testsDone",Number(localStorage.getItem("testsDone")||0)+1);
 $("quizBox").classList.add("hidden");$("result").classList.remove("hidden");
 $("result").innerHTML=`<h3>أحسنتِ 🌷</h3><p>حصلتِ على <b>${score} من ${questions.length}</b> — ${pct}%</p>
 <button class="primary" onclick="showSection('progress')">مشاهدة تقدمي 📊</button>`;
}
function updateProgress(){
 const best=Number(localStorage.getItem("bestScore")||0);
 const done=Number(localStorage.getItem("testsDone")||0);
 $("bestScore").textContent=best+"%";$("testsDone").textContent=done;
 $("progressNumber").textContent=best+"%";$("progressBar").style.width=best+"%";
}
$("themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("light",document.body.classList.contains("light"));};
if(localStorage.getItem("light")==="true")document.body.classList.add("light");
$("saveFeedback").onclick=()=>{
 localStorage.setItem("feedback", $("feedbackText").value);
 $("feedbackSaved").textContent="تم حفظ رأيك على هذا الجهاز 💜";
};
$("feedbackText").value=localStorage.getItem("feedback")||"";
