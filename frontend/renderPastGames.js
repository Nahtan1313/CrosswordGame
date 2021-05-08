firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let  userId;
        if (user != null) {
            userId = user.uid;
            renderList(userId);
        }
    } else {
      // No user is signed in.
    }
});

parseDate = function(date){
    arr = date.split("_");
    d = new Date(arr[0], arr[1]-1, arr[2])
    return d.toDateString();
}

renderList = function(userId){
    const user = firebase.auth().currentUser;
    const database = firebase.database();
    const dbRef = database.ref();
    dbRef.child("users").child(userId).child("puzzles").once("value").then((snapshot) =>{
        let puzzles = snapshot.val();
        let props = Object.keys(puzzles);
        let len = props.length
        let tr;
        let p;
        let time;
        let date;
        let percent;
        let not_done = $("#unfinishedGames_list");
        let done = $("#finishedGames_list");
        
        for(let r = 0; r < len; r++){
            tr = $("<tr></tr>");
            p = puzzles[props[r]];
                time = p['time'];
                date = props[r];
                dateString = parseDate(date)
                percent = p['percentage'];
                completed = p['completed']
            let gameLink = $("<a href = 'game.html?"+date+"'class = 'day_reference button' id = '"+date+"'>"+dateString+"</a>");
            tdDate = $("<td class = dateCol></td>");
                tdDate.append(gameLink);
            tdPercent = $("<td class = percentCol>"+percent+"%</td>");
            tdTime = $("<td class = timeCol>"+time+"</td>");
            tr.append(tdDate, tdPercent, tdTime);
            if(completed){
                done.append(tr); 
            }
            else{
                not_done.append(tr);
            }
        }
    });
}