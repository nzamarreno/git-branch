# Git Branch
_Create your branchs with simplicity_

## Example
```javascript
let originM = new GitBranch(document.querySelector(".example"),  {width: 500, height: 500, widthStroke: 2});

const master = originM.branch("master", {color: "red"});
master.commit("name");
master.commit("Hello");

const school = originM.branch("school", {color: "blue"});
school.commit("nouvelle");
school.commit("nouvelle");

const experience = originM.branch("experience", {color: "blue"});
experience.commit("nouvelle");
experience.commit("nouvelle");

const cons = originM.branch("cons", {color: "blue"});
cons.commit("nouvelle");

originM.push();
```