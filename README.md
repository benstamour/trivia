Trivia Game
===========

This project features a trivia game, with a grid of questions each worth a different number of points and relating to a different category. When the user clicks on one of the blue question tiles, they are given a question to answer, and if they get it correct, the value of the question is added to their score. This was built using React, JavaScript, CSS, and HTML, and it is playable online [here](https://bensta.epizy.com/trivia).

You can customize the project and change the questions by first downloading the files in the `public` and `src` folders and using the command `npx create-react-app trivia` (where `trivia` can be replaced by the chosen name of your new project). In the `public` folder generated by the command, replace `index.html` with the one in the download. In the `src` folder generated by the command, delete all files and replace them with the files in the download. Then use the command `npm start` to run the project locally.

The `trivia.txt` file contains all of the questions, answers, and categories used, and the `blanktemplate.txt` file shows the general layout of how the `trivia.txt` file should look. When editing the file, the names of the five categories should go first, followed by a line each for the question, answer, and accepted answers (in order) for each question, grouped by category and sorted by ascending value within each category (i.e., category 1 Q1, category 1 Q2, ..., category 1 Q5, category 2 Q1, category 2 Q2, etc.)

If a question has more than one accepted answer, separate them by commas and put them all on the same line. If the player's input should equal the accepted answer *exactly*, then add an asterisk at the end of the accepted answer; otherwise, if the accepted answer just has to be found somewhere within the player's answer, do not put an asterisk at the end. Accepted answers are case insensitive.

For example, if the accepted answers for a question were **10\*, ten***, then **10** and **TEN** would be marked correct, but **100**, **10.0**, and **ten thousand** would all be incorrect. If an accepted answer was **Halifax**, both **halifax** and **Halifax, Nova Scotia** would be marked as correct.
