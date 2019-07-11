enum State {
    MERGE,
    COMMIT
}

interface Commit {
    hash: string;
    name: string;
}

interface GitHistory {
    hash: string;
    branch: string;
    status: State;
}


interface Branch {
    name: string;
    hash: string;
    color: string;
    commits: Commit[];
    isMerge: boolean;
    state: State;
    index: number;
}

class SVGCreator {
    pointSize: number = 28;
    strokeWith: number = 3;
    height: number = 0;
    width: number = 0;
    widthStroke: number = 0;
    indexActiveSection: number = 0;
    curve: HTMLElement | null = null;
    classSvg: string = "classSvg";
    branchs: Branch[] = [];
    history: GitHistory[] = [];
        
    constructor(element: HTMLElement, options?: {
        width: number, 
        height: number,
        widthStroke: number
    }) {
        this.curve = element;
        if (options) {
            this.height = options.height;
            this.width = options.width;
            this.widthStroke = options.widthStroke;
        }
        
        this.init();
        this.createSchoolPath();
        this.createWorkPath();
    }
    
    public branch(name: string, options?: {color: string}) {
        let params: Branch;
        
        if (options) {
            params = {...options};            
        }
        
        params.hash = this.uuidv4();
        params.name = name;
        params.commits = [];
        params.index = this.branchs.length + 1;
        
        this.branchs.push(params);
        
        return {
            name: name,
            commit: (value: string, message?: string) => this.commit(name, value, message),
            merge: (branch: string, commit: string) => this.merge(branch, commit)
        };
    }
    
    public merge = (branch: string, commit: string) => {
        const hash = this.uuidv4();
        const currentBranch = this.branchs.find(x => x.name === branch);
        if(currentBranch) currentBranch.commits.push({name: commit, hash: hash});
        currentBranch.state = State.MERGE;
        const enter: GitHistory = {hash: hash, branch: branch, status: State.MERGE};
        this.history.push(enter);
    }
    
    public commit = (name: string, value: string, message?: string) => {
        const hash = this.uuidv4();
        const branch = this.branchs.find(x => x.name === name);
        if(branch) branch.commits.push({name: value, hash: hash});
        this.history.push({hash: hash, branch: branch.name, status: State.COMMIT});
    }

    private init = () => {
        let curriculum = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        
        curriculum.setAttribute("width", this.width.toString());
        curriculum.setAttribute("height", this.height.toString());
        curriculum.setAttribute("class", this.classSvg);
        curriculum.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        // add the text node to the newly created div
        this.curve.appendChild(curriculum);
    }
    
    private createWorkPath = () => {
        const svgPath = document.querySelector(`.${this.classSvg}`);
        let pathWork = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // M Put your pen and L draw towards this point
        pathWork.setAttribute("d", `M ${this.widthStroke / 2} 10 L ${this.widthStroke / 2} ${this.height}`);
        pathWork.setAttribute("stroke-width", this.widthStroke.toString());
        svgPath.appendChild(pathWork);
    }
    
    private createSchoolPath = () => {
        const svgPath = document.querySelector(`.${this.classSvg}`);
//         const idClip = "cut-off-bottom";
//         const clip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");;
//         clip.setAttribute("id", idClip);
//         svgPath.appendChild(clip);
        
//         const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");;
//         // Set visible part
//         rect.setAttribute("x", "250");
//         rect.setAttribute("y", "0");
//         rect.setAttribute("height", "250");
//         rect.setAttribute("width", "500");
//         clip.appendChild(rect);
        
        const rectrect = document.createElementNS("http://www.w3.org/2000/svg", "rect");;
        rectrect.setAttribute("x", "-190");
        rectrect.setAttribute("y", "70");
        rectrect.setAttribute("width", "260");
        rectrect.setAttribute("height", "300");
        rectrect.setAttribute("rx", "40");
        rectrect.setAttribute("stroke", "#E89D42");
        rectrect.setAttribute("stroke-width", this.widthStroke.toString());
        rectrect.setAttribute("fill", "#FFF");
        // rectrect.setAttribute("clip-path", `url(#${idClip})`);
        svgPath.appendChild(rectrect);
    }
    
    private uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    setActiveSection = (indexSection: number) => {
        this.indexActiveSection = indexSection;
    }
    
    public push() {
        this.createCommit();
        this.createBranch();
    }

    createBranch = () => {
        
    }
    
    createCommit = () => {  
        const array = this.branchs.map(x => x.commits.length);
        let total = 0;
        array.forEach(x => total = total + x);
        const distance = this.height / total;
        let distanceTotal = 0;
        let index = 0;
        let branchDistance: number[] = [];
        this.branchs.forEach((branch, indexBranch) => {
            branchDistance.push(distanceTotal);
            branch.commits.forEach((commit, indexCommit) => {
                let isActive = false;
                let indexToMultiply = 0;
                indexToMultiply = index * distance;
                distanceTotal = indexToMultiply;
                console.log(indexToMultiply)
                let exp = document.createElement("div");
                exp.setAttribute("class", `curry__point ${index === this.indexActiveSection ? "curry__point--active" : ""}`);
                exp.setAttribute("style", `top:${indexToMultiply}px;left:${30 * indexBranch}px`);
                this.curve.appendChild(exp);
                index++;
            })
            
        })

        console.log(branchDistance);
    }
}

let originM = new SVGCreator(document.querySelector(".example"),  {width: 500, height: 500, widthStroke: 2});

const master = originM.branch("master", {color: "red"});
master.commit("name");
master.commit("Hello");

const school = originM.branch("school", {color: "blue"});
school.commit("nouvelle");

const experience = originM.branch("experience", {color: "blue"});
experience.commit("nouvelle");

school.merge(master.name, "Merge");
originM.push();
