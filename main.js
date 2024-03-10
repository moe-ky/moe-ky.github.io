const projects = ["tld", "ltc"]

projectMapping = {
    tld: `
    <p>
        <hr></hr>
        <header> <h1> The Letter Digest </h1> </header>
        Provides you with Insights & Digests on your favorite newsletters.
        Scratching my own itch itch with newsletters, I always have too many in my inbox to read. 
        So I built this to help me get the gist of multiple newsletters quickly, to help me discern the newsletters I was really interested in reading.
        <br><br>
        <a target="_blank" href="https://theletterdigest.com">Link To Site</a>
    </p>
    `,
    ltc: `
    <p>
        <hr></hr>
        <header> <h1> Learn To Code </h1> </header>
        I created this small digital e-book for beginners looking to take their coding journey to the next level.
        This is my first attempt at an e-book and I look forward to producing more content like this, to help others on their journey.
        <br><br>
        <a target="_blank" href="https://www.dropbox.com/s/xo3cec5uo6kpbsw/Learn-To-Code-By-Solving-Problem-Book-1-final.pdf?dl=0">Link To E-Book</a>
    </p>
    `
}
document.addEventListener("DOMContentLoaded", () => {
    // projects.forEach((project) => {
    //     document.getElementById(project).addEventListener("click", (e)=>{
    //         e.preventDefault();
    //         document.getElementById("msg-box").innerHTML = projectMapping[project]
    //     })
    // })
  });
