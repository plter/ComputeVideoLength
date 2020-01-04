import VideoTool from "../tools/VideoTool";

const Tpl = require("../views/MainApp.html");

const MainApp = Vue.component("main-app", {
    template: Tpl,
    data() {
        return {
            selectedDirPath: "",
            videoFilesFound: [],
            working: false,
            totalVideoLength: 0
        }
    },
    methods: {
        async btnSelectDirClicked(e) {
            let result = await electron.remote.dialog.showOpenDialog(electron.remote.getCurrentWindow(), {properties: ["openDirectory"]});
            if (!result.canceled) {
                this.selectedDirPath = result.filePaths[0];

                await this.startFindInDirTask(this.selectedDirPath);
            }
        },

        async findInDir(dir) {
            if (!(await fs_stat(dir)).isDirectory()) {
                return;
            }

            let children = await fs_readdir(dir);
            for (let filename of children) {
                let f = path.join(dir, filename);
                let s = await fs_stat(f);
                if (s.isFile()) {
                    if (f.toLowerCase().endsWith(".mp4")) {
                        this.videoFilesFound.push(f);
                    }
                } else if (s.isDirectory()) {
                    await this.findInDir(f);
                }
            }
        },

        dragOverHandler(e) {
            e.preventDefault();
        },

        async startFindInDirTask(dir) {
            this.videoFilesFound.length = 0;
            this.working = true;
            await this.findInDir(dir);
            this.working = false;

            this.startGetVideoLengthTask();
        },

        async startGetVideoLengthTask() {
            this.totalVideoLength = 0;
            this.working = true;
            for (let vf of this.videoFilesFound) {
                try {
                    let d = await VideoTool.getVideoLength(vf);
                    this.totalVideoLength += d;
                } catch (errorMessage) {
                    let d = await electron.remote.dialog.showMessageBox(electron.remote.getCurrentWindow(), {
                        message: errorMessage,
                        buttons: ['忽略', "停止"],
                        defaultId: 0
                    });
                    if (d.response == 1) {
                        break;
                    }
                }

            }
            this.working = false;
        },

        async dropHandler(e) {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                let firstFile = e.dataTransfer.files[0];
                let firstFilePath = firstFile.path;
                let s = await fs_stat(firstFilePath);
                if (s.isDirectory()) {
                    this.selectedDirPath = firstFilePath;

                    await this.startFindInDirTask(this.selectedDirPath);
                }
            }
        }
    },

    computed: {
        workState() {
            return this.working ? "正在工作..." : "完毕";
        },

        readableTotalVideoLength() {
            let h = Math.floor(this.totalVideoLength / 3600);
            let m = Math.floor((this.totalVideoLength % 3600) / 60);
            let s = Math.floor(this.totalVideoLength % 60);
            return `${h}:${m}:${s}`;
        }
    }
});


let root = document.createElement("div");
document.body.appendChild(root);

new MainApp().$mount(root);