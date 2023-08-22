# react-project-9
 
## This is a Quiz App called SmartU I built all by myself from scratch.

### Check out [SmartU](https://smartu.vercel.app) on Vercel

This project was also the last of the projects assigned with the Intro React course by Bob Ziroll.

It fetches questions and answers (both incorrect and correct) and then renders that to UI. 


The project was challenging, fun and really exciting to develop. I also learned a great deal by answering the questions too.

## Challenges

I faced a lot of challenges while building this project. One was the issue of randomizing the answers. Stack Overflow came to the rescue. 

The most significant issue I faced was with setting a background color to the options selected. The problem was that when a user selects an option, it sets the background color and also that of other questions' options having the same index. 

Another thing was that when I click on any option, they switch positions. Couldn't find a solution on Stack Overflow and no one seemed to know what was wrong with the code. Eventually resulted to using Chatgpt, which pointed out the areas I was having issues. It turned out that I was using the same state to track all the questions and their options which resulted in the weird behavior of them all being selected as described above. Had to refactor my code and initialize them directly as I was fetching them inside the useEffect. This made me not call the function that was scrambling the options again on each re-render.

## Updates

#### I referred people to help review the project and while the reviews were good, the feedbacks were that there was no way to indicate the option the user picked when they click on the `Show Answers` button as all the wrong options and the correct were styled leaving the users confused as to which option they chose initially.

#### I went back to my code and fixed this issue and some others I discovered like getting the option the user selects even if they change their mind which I fixed by consulting Stack Overflow and nice folks on there guided me right. I was also able to disable the button so that the user can't cheat by clicking on the correct answers which increases their scores after the correct answers have been shown. 


## Future features

##### I might later add some additional features such as making a user select the categories of questions they want as currently, they are set to a default category which is the Computer Science category and I think I will also add a feature whereby users can choose the difficulty levels.  


📸Here is a [screenshot](screenshot-mobile.png) of the mobile page on the localhost.
This is for [wider screens](screenshot-tablet.png).
