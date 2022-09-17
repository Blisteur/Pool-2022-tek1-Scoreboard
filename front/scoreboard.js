
const CatListItem = Vue.component("cat-list-item", {
    template: "#cat-list-item",
    props: ["cat", "rank"],
    data() {
      return {
        colors: ["#d6cd1e", "#bbbbbb", "#d6a21e"]
      };
    },
    computed: {
      rankOrder: function () {
        return this.rank + 1;
      },
      colorOrder: function () {
        return this.colors[this.rank];
      }
    },
  });
  
  var vue = new Vue({
    el: "#app",
  
    components: {
      CatListItem
    },
  
    data() {
      return {
        cats: [
          {
            name: "Mage",
            photo: "mage.png",
            points: 0
          },
          {
            name: "Voleur",
            photo: "voleur.png",
            points: 0
          },
          {
            name: "Clerc",
            photo: "clerc.png",
            points: 0
          },
          {
            name: "Guerrier",
            photo: "guerrier.png",
            points: 0
          }
        ],
        catRank: [
          { r: 2, c: "#d6a21e" },
          { r: 0, c: "#d6cd1e" },
          { r: 1, c: "#bbbbbb" }
        ],
        newLeader: ""
      };
    },
  
    computed: {
      allCats: function () {
        return [...this.cats].sort((a, b) => b.points - a.points);
      },
      topThreeCats: function () {
        let topThree = [...this.cats]
          .sort((a, b) => b.points - a.points)
          .slice(0, 3);
        let order = [topThree[2], topThree[0], topThree[1]];
        return order;
      },
      leadCat() {
        return this.topThreeCats.map((cat) => cat.name);
      }
    },
  
    watch: {
      leadCat(newValue, oldValue) {
        if (newValue[1] !== oldValue[1]) {
          this.newLeader = newValue[1];
        } else {
          this.newLeader = "";
        }
      }
    }
  });
  
  $(document).ready(
    function() {
   
    // inspired by http://jsfiddle.net/arunpjohny/564Lxosz/1/
    $('.table-responsive-stack').find("th").each(function (i) {
       $('.table-responsive-stack td:nth-child(' + (i + 1) + ')').prepend('<span class="table-responsive-stack-thead">'+ $(this).text() + ':</span> ');
       $('.table-responsive-stack-thead').hide();
    })
    }
  );

// caall api
function getEvents() {
  fetch('http://127.0.0.1:8080/api/events')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var events = document.getElementById('scoreboardHistory');
      events.innerHTML = '';
      data.reverse().forEach((score, index) => {
        var tr = document.createElement('tr');
        var tddesc = document.createElement('td');
        var tdpoint = document.createElement('td');
        var tdwho = document.createElement('td');
        var tdteam = document.createElement('td');
        tddesc.innerHTML = score.name;
        tdpoint.innerHTML = score.score;
        tdwho.innerHTML = score.user;
        tdteam.innerHTML = score.team;
        tr.appendChild(tddesc);
        tr.appendChild(tdpoint);
        tr.appendChild(tdwho);
        tr.appendChild(tdteam);
        events.appendChild(tr);
      });
    });
}

// update scoreboard
function updateScoreboard() {
  fetch('http://127.0.0.1:8080/api/scoreboard')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach((score, index) => {
        vue.cats[index].points = score.score;
      });
    });
}

getEvents();
updateScoreboard();
setInterval(getEvents, 10000);
setInterval(updateScoreboard, 10000);
