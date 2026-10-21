# Chapter 9, the reaction test (DESIGN_SPEC §9 ch09, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
T = 'frmTest'
CH = {
 "id": "09", "n": 9, "of": 15, "title": "The reaction test", "kind": "new", "color": "#C2185B",
 "one": "A new form with twelve pictures, two timers and a ten-second score.",
 "prev": {"id": "08", "n": 8, "title": "The data entry form: its Load event"},
 "next": {"id": "10", "n": 10, "title": "Work out the group"},
 "methods": [[D, "btnTakeTest_Click"], [T, "frmTest_Load"], [T, "PictureBox_Click"], [T, "btnStart_Click"], [T, "tmrSwap_Tick"], [T, "tmrCountdown_Tick"]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "thing": "the parts this chapter needs", "verb": "checking", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have", "done": "every row is ticked, or you have gone where its link says",
    "goal": "Before I start, I check Global.cs, the test panel on the data entry form and the data entry Load event.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters, so this screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Does Global.cs have reactionTestScore and reactionTestTaken?",
          "Double-click Global.cs in Solution Explorer.", "Go to chapter 3, part 3.", "#cw/03/3-1"),
     have("1-1.t2", "On frmDataEntry, does the test panel have a Take test button and a status label?",
          "Open frmDataEntry in the Design tab. Look inside the test panel.", "Go to chapter 2, part 3.", "#cw/02/3-1"),
     have("1-1.t3", "Is the data entry Load event done, so the test panel switches on after the quiz?",
          "Run the program and take the quiz. Look at the test panel.", "Go to chapter 8.", "#cw/08/1-1")]}
   ]}]},
  {"id": "2", "title": "Make yours look different", "thing": "your look and your pictures", "verb": "making", "screens": [
   opener("Choose your own look and save your pictures", "This part is where YOUR test becomes different from MINE. You choose the look, then save your pictures where the program can find them.",
           "Every reaction test works the same way underneath. The shape, the pictures and the timing are YOUR choices.",
           "When it works, your four choices are written down. Your pictures sit in the Images folder."),
   {"id": "1", "title": "Choose how YOUR reaction test will look", "foot": "next", "done": "you have read all four cards",
    "goal": "The idea of the test stays the same, but the look of mine is my own choice.",
    "blocks": [
    {"p": "Every reaction test works the same way, but the look of yours is YOUR choice."},
    {"drawn": {"id": "four-choices", "alt": "Four cards: shape, pictures, which boxes swap, time and speed. Each turns over to show other ideas.",
               "say": "Each card shows MY choice first, then turns over to show other ideas.",
               "cards": [["Shape", "3 rows of 4", ["4 rows of 3", "2 rows of 6", "a ring"]],
                         ["Pictures", "three flags", ["a tick and a cross", "a fish and a shark", "a star and a bomb"]],
                         ["Which boxes swap", "6 of the 12", ["choose 4", "choose 6", "choose 8"]],
                         ["Time and speed", "10 seconds, a swap every second", ["15 seconds", "a swap every 0.7 seconds"]]]}},
    {"p": "In MY example, the red and yellow flag scores a point. The red flag and the black and white flag lose one."},
   ]},
   {"id": "2", "title": "Write your four choices down", "foot": "next", "done": "your four choices are written down",
    "goal": "The idea of the test stays the same, but I choose my own shape, pictures, swapping boxes and timing.",
    "blocks": [
    {"p": "Decide four things: your shape, your pictures, which boxes swap, and your time and speed."},
    {"yours": "Write YOUR four choices on paper now. MY choices are flags in a grid, swapping every second, for ten seconds. Do not use MY flag pictures."}
   ]},
   {"id": "3", "title": "Put your pictures in the right folder", "foot": "done", "done": "your pictures are inside Images, inside Debug, inside bin",
    "goal": "My two or three pictures are saved in a folder called Images inside bin and then Debug.",
    "blocks": [
    {"p": "This screen makes the one folder where your program looks for its pictures."},
    {"steps": [
     step("2-2.1", "In Solution Explorer, right-click your project's name. Click Open Folder in File Explorer.",
          "File Explorer opens on your project's folder."),
     step("2-2.2", "Double-click the bin folder. Then double-click the Debug folder.",
          "You can see the files of your program.",
          None, [["There is no bin folder.", "Run the program once with the green arrow, then look again."]]),
     step("2-2.3", "Make a new folder here. Name it Images.",
          "A folder called Images sits inside Debug."),
     step("2-2.4", "Find two or three small pictures on the web. Save them in Images as .jpeg or .png files.",
          "Your pictures are in Images, each with a short name.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F19", "Find the Debug folder", [
        ("f19-1", "Solution Explorer with the right-click menu open on the project", "Right-click the project. Click Open Folder in File Explorer."),
        ("f19-2", "File Explorer showing the bin folder", "Double-click bin."),
        ("f19-3", "File Explorer showing the Debug folder", "Double-click Debug."),
        ("f19-4", "The Debug folder with a new folder called Images", "Make a new folder called Images here.")])]}},
    {"watch": "MY pictures are RedAndYellowFlag.jpeg, RedFlag.jpeg and BlackAndWhiteFlag.jpeg. Write down YOUR exact file names."}
   ]}]},
  {"id": "3", "title": "The reaction test form: its pictures and buttons", "thing": "the reaction test form", "verb": "making", "screens": [
   opener("Make the reaction test form", "This part adds frmTest and puts everything on it: twelve picture boxes, a score panel and two timers. A timer is a clock that ticks in code.",
           "Nothing works yet. This part only lays the form out, the way you laid out the quiz form.",
           "When it works, frmTest has twelve picture boxes, a score panel and two timers under it."),
   {"id": "1", "title": "Add the reaction test form", "foot": "done", "done": "frmTest is in Solution Explorer with its two labels on it",
    "goal": "A new form called frmTest is in Solution Explorer, with a title label and an instructions label.",
    "blocks": [
    {"p": "The reaction test gets a form of its own, added the way you added the quiz."},
    {"steps": [
     step("3-1.1", "Click the Project menu along the top. Click the line that starts Add Form.",
          "A box opens with Form picked in its list."),
     step("3-1.2", "In the Name box at the bottom, type frmTest.cs. Click Add.",
          "frmTest opens in the Design tab. It is empty."),
     step("3-1.3", "Drag two labels onto the top of the form. Name them lblSafeToSwimSprint and lblInstructions.",
          "Two labels sit at the top of frmTest.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F5", "Add a new form", [
        ("f5-1", "The Project menu open, with Add Form in its list", "Open the Project menu. Click the line that starts Add Form."),
        ("f5-2", "The Add New Item box with Form picked and a name in the Name box", "Form is picked. Type the form's name in the Name box."),
        ("f5-3", "The new empty form in the Design tab", "Click Add. The new form opens in the Design tab. My picture says frmTemp. Yours shows the name you typed.")])]}},
    {"yours": "MY title label says Safe to Swim Sprint. Give YOUR title and instructions the words YOUR test needs."}
   ]},
   {"id": "2", "title": "Add twelve picture boxes", "foot": "done", "done": "twelve picture boxes named pbx1 to pbx12 sit on frmTest",
    "goal": "Twelve picture boxes sit on frmTest, named pbx1 to pbx12 in reading order, each stretching its picture.",
    "blocks": [
    {"p": "Make one picture box with the right settings, then make eleven more the same."},
    {"steps": [
     step("3-2.1", "Drag one PictureBox from the Toolbox onto the form.",
          "A square picture box sits on the form."),
     step("3-2.2", "In Properties, set SizeMode to StretchImage. Set its Size, for example 100, 100.",
          "The picture box is the size you want."),
     step("3-2.3", "Right-click the picture box and click Copy. Right-click the form and click Paste.",
          "A second picture box appears. Do this until there are twelve."),
     step("3-2.4", "Drag them into YOUR shape. Name them pbx1 to pbx12, left to right, row by row.",
          "Twelve picture boxes, pbx1 at the top left.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F2", "Give a control its name", [
        ("f2-1", "A text box on the login form clicked once, with its handles showing", "Click the control once. Little squares appear round it."),
        ("f2-2", "The Properties window with the Name line near the top", "In Properties, find the word Name. It is near the top of the list."),
        ("f2-3", "The Name line in Properties changed to tbxUsername", "Type the new name and press Enter.")])]}},
    {"watch": "Name them in reading order. The code on later screens uses these twelve names."}
   ]},
   {"id": "3", "title": "Add the score panel", "foot": "done", "done": "the score panel holds every control in the table with its name set",
    "goal": "The score panel holds the Start button, the score, the time left, the pupil's name and the ? button.",
    "blocks": [
    {"p": "Drag a panel onto the form, then drag each control in the table into it."},
    {"controls": {"form": T, "rows": [
      {"toolbox": "Panel", "name": "pnlReactionTestStats", "set": []},
      {"toolbox": "Button", "name": "btnStart", "set": ["Text = Start"]},
      {"toolbox": "Label", "name": "lblScore", "set": ["Text = Score: 0"]},
      {"toolbox": "Label", "name": "lblTime", "set": ["Text = 10"]},
      {"toolbox": "Label", "name": "lblName", "set": ["Text = Name"]},
      {"toolbox": "Button", "name": "btnHelpReactionTest", "set": ["Text = ?"]}],
     "done": "The last five sit inside pnlReactionTestStats. The ? button gets its code in chapter 13."}},
    {"yours": "lblTime shows 10 because MY test lasts 10 seconds. Type the number of seconds YOU chose."}
   ]},
   {"id": "4", "title": "Meet the two timers and the new words", "foot": "done", "done": "you have read what the two timers do and seen the word list",
    "goal": "I know what tmrSwap and tmrCountdown are for before I add them.",
    "blocks": [
    {"p": "The test needs two clocks: one swaps the pictures and the other counts the seconds down."},
    {"p": "Below are the new words in this chapter, each with the screen it first appears on."},
    {"words": [
      ["Timer", "A control you cannot see that ticks on its own.", "3-4", False],
      ["Interval", "The gap between ticks. 1000 means one second.", "3-4", False],
      ["List<PictureBox>", "A list that holds picture boxes.", "4-1", True],
      ["sender as PictureBox", "The picture box that was clicked.", "5-1", True],
      ["!=", "Is not.", "5-1", True],
      ["ImageLocation", "The path of the picture it shows.", "5-2", True],
      ["@\"Images\\…\"", "Take this path exactly as typed.", "5-2", True],
      ["foreach", "Do this once for each thing in the list.", "6-2", True],
      [".Start()", "Set the timer ticking.", "6-2", True],
      ["--", "Take one off.", "6-5", True],
      [".Stop()", "Stop the timer ticking.", "6-5", True]],
     "intro": "Eleven new things in this chapter. Click any marked word to see what it means."},
   ]},
   {"id": "5", "title": "Add two timers", "foot": "done", "done": "tmrSwap and tmrCountdown sit under the form with Interval 1000",
    "goal": "Two timers called tmrSwap and tmrCountdown sit in the grey strip under the form, each with Interval 1000.",
    "blocks": [
    {"p": "Timers live in the grey strip under the form, not on it."},
    {"steps": [
     step("3-4.1", "In the Toolbox, find [[Timer|0]]. Drag it onto the form, twice.",
          "Two timers sit in a grey strip under the form, not on it."),
     step("3-4.2", "Name them tmrSwap and tmrCountdown. Set the [[Interval|1]] of each one to 1000.",
          "Each timer ticks once every second. Leave Enabled unticked. The code starts them.")]},
    {"yours": "1000 is one second. If YOUR pictures swap every 0.7 seconds, type 700 for tmrSwap."}
   ]}]},
  {"id": "4", "title": "The code before any click", "thing": "the code as the form opens", "verb": "making", "screens": [
   opener("Type the code that runs as the test form opens", "This part types two lines at the top of frmTest's code, then its Load event. The Load event is the code that runs when the form opens.",
           "The Load event shows the pupil's name and puts all twelve picture boxes into one list. Later code uses that list.",
           "When it works, two new lines sit at the top and frmTest_Load has five new lines."),
   {"id": "1", "title": "Type two lines at the top of the form's code", "foot": "done", "done": "the two lines are typed above public frmTest() and have no red squiggles",
    "goal": "Two lines at the top of frmTest's code make the countdown start at 10 and make room for a list of picture boxes.",
    "blocks": [
    {"p": "Double-click frmTest in Solution Explorer, then click View along the top and click Code."},
    {"code": {"id": "4-1.c1", "kind": "type", "snippet": True, "title": "Two lines at the top", "lang": "cs",
              "where": "near the top, above the line public frmTest()",
              "text": "private int CountdownValue = 10;\nprivate List<PictureBox> pictureboxes;",
              "partLines": [[1, 1, "The seconds left", "A whole number that starts at 10. The countdown takes one off each second."],
                            [2, 2, "Room for a list", "A list that will hold all twelve picture boxes."]],
              "names": ["CountdownValue", "pictureboxes"], "isense": [],
              "yours": "MY test lasts 10 seconds. If YOU chose 15 seconds, type 15."}},
    {"p": "[[List<PictureBox>|2]] is a list that holds picture boxes. The next screen fills it."},
    {"box": {"title": "See where they go", "fold": True, "blocks": [
      frames("F20", "The top of frmTest's code", [
        ("f20-1", "The top of frmTest.cs with the two lines typed above the public frmTest() line", "The two lines go near the top, above public frmTest().")])]}}
   ]},
   {"id": "2", "title": "Fill the list as the form opens", "foot": "done", "done": "lines 3 to 7 are typed and the code has no red squiggles",
    "goal": "The Load event of frmTest shows the pupil's name and puts all twelve picture boxes into one list.",
    "blocks": [
    {"p": "In the Design tab, double-click the title bar of frmTest to make frmTest_Load appear."},
    {"box": {"title": "See the list as a picture", "fold": True, "blocks": [
      {"drawn": {"id": "list-card", "alt": "Twelve small boxes named pbx1 to pbx12 jump one by one into a single card called pictureboxes.",
                 "say": "All twelve boxes go into one list called pictureboxes."}}]}},
    code("4-2.c1", "The Load event of frmTest", "between the curly brackets of frmTest_Load", T, "frmTest_Load", 1, 8,
         [given(1, 2),
          [3, 3, "The name", "The first name, a space, then the surname from Global.cs."],
          [4, 7, "The list", "A new list, and the twelve boxes inside its curly brackets."],
          given(8, 8)],
         ["lblName", "Global.firstname", "Global.surname", "pictureboxes", "pbx1 to pbx12"], ["lblName"])
   ]}]},
  {"id": "5", "title": "What a click does", "thing": "the click code", "verb": "making", "screens": [
   opener("Make one piece of code for every picture click", "This part makes PictureBox_Click. It runs when any of the twelve boxes is clicked.",
           "Normally each button gets its own click code. Here one piece of code serves all twelve boxes.",
           "When it works, PictureBox_Click has 17 lines. A click scores a point or loses one, then hides the picture."),
   {"id": "1", "title": "Type the first line of the click code yourself", "foot": "done", "done": "lines 1 to 5 are typed and the code has no red squiggles",
    "goal": "One piece of code, PictureBox_Click, runs for any of the twelve boxes, and it finds out which box was clicked.",
    "blocks": [
    {"p": "Until now a double-click wrote the first line for you, but this one you type yourself."},
    {"p": "[[sender as PictureBox|3]] is the box that was clicked. [[!=|4]] means is not."},
    code("5-1.c1", "The click code: code 1 of 2", "under the last curly bracket of frmTest_Load", T, "PictureBox_Click", 1, 5,
         [[1, 2, "The first line", "Type the whole line and the curly bracket yourself. No double-click makes this one."],
          [3, 3, "Which box was clicked?", "sender is the box that was clicked. as PictureBox treats it as a picture box."],
          [4, 5, "Only if a box was clicked", "null means nothing. The lines below run only when there is a box."]],
         ["PictureBox_Click", "clickedPicturebox"], ["clickedPicturebox"]),
    {"watch": "Type PictureBox_Click exactly. Screen 6-3 joins all twelve boxes to this name."}
   ]},
   {"id": "2", "title": "Score the click and hide the picture", "foot": "done", "done": "lines 6 to 17 are typed and the code has no red squiggles",
    "goal": "A click on the winning picture adds one to the score, any other picture takes one off, and the picture hides.",
    "blocks": [
    {"p": "A path is where a picture file lives, folder and file name together."},
    {"p": "[[ImageLocation|5]] is the path of the picture a box shows."},
    {"p": "The [[@ sign|6]] keeps the path exactly as typed."},
    code("5-2.c1", "The click code: code 2 of 2", "under code 1, inside PictureBox_Click", T, "PictureBox_Click", 6, 17,
         [[6, 13, "Win or lose a point", "If the box shows the winning picture, add one. Otherwise take one off."],
          [14, 15, "Show the score, hide the box", "The score turns into words for lblScore. The clicked box hides."],
          [16, 17, "Close both curly brackets", "The first closes the if. The last ends the click code."]],
         ["clickedPicturebox", "Global.reactionTestScore", "lblScore"], ["lblScore"],
         yours="MY winning picture is RedAndYellowFlag.jpeg. Type YOUR winning picture's file name, exactly as you saved it.")
   ]}]},
  {"id": "6", "title": "Start, swap, count down", "thing": "the Start button and two timers", "verb": "making", "screens": [
   opener("Make the Start button and the two timers work", "This part types the code behind Start, tmrSwap and tmrCountdown. That is the whole test running.",
           "Start fills the boxes, joins the clicks and starts both clocks. One clock swaps pictures, the other counts down.",
           "When it works, the test runs for YOUR seconds, shows the score and goes back."),
   {"id": "1", "title": "Give every box a starting picture", "foot": "done", "done": "lines 3 to 14 are typed with YOUR twelve file names and no red squiggles",
    "goal": "When Start is clicked, each of the twelve boxes is given its first picture, a mix of winners and losers.",
    "blocks": [
    {"p": "In the Design tab, double-click the Start button."},
    {"p": "Each of the twelve boxes is told where its first picture lives, winners and losers mixed."},
    code("6-1.c1", "The Start button: code 1 of 2", "between the curly brackets of btnStart_Click", T, "btnStart_Click", 1, 14,
         [given(1, 2),
          [3, 14, "All twelve boxes", "Each box is told where its first picture lives. Winners and losers are mixed."]],
         ["pbx1 to pbx12"], ["pbx1"],
         yours="MY pictures are three flags. Type YOUR file names, exactly as you saved them in Images.")
   ]},
   {"id": "2", "title": "See the loop join every box to the click code", "foot": "done", "done": "you have looked at the picture and read the line under it",
    "goal": "I see how one loop joins all twelve boxes to PictureBox_Click.",
    "blocks": [
    {"p": "A loop is code that repeats, and [[foreach|7]] repeats once for each box in the list."},
    {"drawn": {"id": "wire-boxes", "alt": "A loop card on the left. One by one, each of the twelve boxes lights up with a spark.",
               "say": "The loop tells every box: when you are clicked, run PictureBox_Click."}},
   ]},
   {"id": "3", "title": "Join the clicks and start the clocks", "foot": "done", "done": "lines 15 to 22 are typed and the code has no red squiggles",
    "goal": "A loop joins every box to PictureBox_Click, both timers start, and the Start button switches itself off.",
    "blocks": [
    {"p": "[[.Start()|8]] sets a timer ticking, and then the Start button switches itself off."},
    code("6-2.c1", "The Start button: code 2 of 2", "under code 1, inside btnStart_Click", T, "btnStart_Click", 15, 23,
         [[15, 19, "Join every box to the click code", "An empty line. Then, for each box in the list, a click runs PictureBox_Click."],
          [20, 22, "Start the clocks", "Both timers start. Start switches itself off, so it cannot be clicked twice."],
          given(23, 23)],
         ["pictureboxes", "pb", "PictureBox_Click", "tmrSwap", "tmrCountdown", "btnStart"], ["tmrSwap"])
   ]},
   {"id": "4", "title": "Swap the pictures every tick", "foot": "done", "done": "lines 3 to 10 are typed and the code has no red squiggles",
    "goal": "Each tick of tmrSwap turns a winning picture into a losing one, and a losing one into a winner.",
    "blocks": [
    {"p": "In the Design tab, double-click tmrSwap in the grey strip to open its tick code."},
    code("6-3.c1", "The swap timer", "between the curly brackets of tmrSwap_Tick", T, "tmrSwap_Tick", 1, 10,
         [given(1, 2),
          [3, 10, "One box swaps", "If pbx4 shows the red flag, it gets the winner. Otherwise it gets the red flag."]],
         ["pbx4"], ["pbx4"],
         rest=[11, 52, "Now the same for each box YOU chose to swap. MY example also swaps pbx5, pbx2, pbx9, pbx1 and pbx11."],
         yours="MY swaps are between two flags. Use YOUR winning picture and one of YOUR losing pictures.")
   ]},
   {"id": "5", "title": "Count down one second at a time", "foot": "done", "done": "lines 3 to 8 are typed and the code has no red squiggles",
    "goal": "Each tick of tmrCountdown takes one off the seconds left and shows it, and at zero both timers stop.",
    "blocks": [
    {"p": "In the Design tab, double-click tmrCountdown in the grey strip."},
    {"p": "[[--|9]] takes one off, and [[.Stop()|10]] stops a timer."},
    code("6-4.c1", "The countdown timer: code 1 of 2", "between the curly brackets of tmrCountdown_Tick", T, "tmrCountdown_Tick", 1, 8,
         [given(1, 2),
          [3, 4, "One second less", "Take one off the seconds left. Show the new number in lblTime."],
          [5, 8, "At zero, stop both clocks", "When the seconds left reach 0, both timers stop."]],
         ["CountdownValue", "lblTime", "tmrCountdown", "tmrSwap"], ["lblTime"]),
    {"watch": "The curly bracket of the if stays open here. Code 2 closes it."}
   ]},
   {"id": "6", "title": "Show the score and go back", "foot": "done", "done": "lines 9 to 16 are typed and the code has no red squiggles",
    "goal": "At zero, a message shows the score, Global.cs records that the test is taken, and the data entry form opens again.",
    "blocks": [
    {"p": "Still inside the if, these lines run once, when the seconds left reach zero."},
    code("6-5.c1", "The countdown timer: code 2 of 2", "under code 1, inside tmrCountdown_Tick", T, "tmrCountdown_Tick", 9, 17,
         [[9, 12, "The score, and the test is taken", "An empty line. A message shows the score. Global.cs records the test as taken."],
          [13, 16, "Go back", "An empty line. This form closes and a new data entry form opens. Then the if closes."],
          given(17, 17)],
         ["Global.reactionTestScore", "Global.reactionTestTaken", "frmDataEntry"], ["Global.reactionTestTaken"])
   ]}]},
  {"id": "7", "title": "Getting there, and Try it", "thing": "the Take test button, then a try", "verb": "testing", "screens": [
   opener("Open the test from data entry, then try it", "This part makes the Take test button open the test. Then you try the whole thing.",
           "Take test closes the data entry form and opens frmTest. Take quiz did the same in chapter 6.",
           "When it works, every row on the try screen is ticked."),
   {"id": "1", "title": "Open the reaction test from the data entry form", "foot": "done", "done": "lines 3 to 5 are typed and the code has no red squiggles",
    "goal": "The Take test button closes the data entry form and opens the reaction test form.",
    "blocks": [
    {"p": "Open frmDataEntry in the Design tab and double-click the Take test button."},
    code("7-1.c1", "The Take test button", "between the curly brackets of btnTakeTest_Click", D, "btnTakeTest_Click", 1, 6,
         [given(1, 2),
          [3, 5, "Swap to the test", "A note for you. This form closes, then a new reaction test form opens."],
          given(6, 6)],
         ["frmTest"], ["frmTest"])
   ]},
   {"id": "2", "title": "Try your reaction test", "foot": "chapter-done", "done": "every row is ticked, or you have gone where its link says",
    "goal": "I run the program and check the name, the swaps, the score, the countdown and the way back.",
    "blocks": [
    {"p": "Run your program, log in, enter the details, take the quiz, then try each row."},
    {"check": [
     tryit("7-2.t1", "Click Take test.", "The reaction test opens with your name on it.", "Look at the code on screens 7-1 and 4-2.", "#cw/09/7-1"),
     tryit("7-2.t2", "Click Start.", "Twelve pictures appear. The boxes you chose swap every tick.", "Look at the code on screens 6-1 and 6-4.", "#cw/09/6-1"),
     tryit("7-2.t3", "Click a winning picture, then a losing one.", "The score goes up by one, then down by one. Each picture hides.", "Look at the code on screen 5-2.", "#cw/09/5-2"),
     tryit("7-2.t4", "Wait for the time to reach zero.", "A message shows the score. The data entry form comes back.", "Look at the code on screen 6-6.", "#cw/09/6-6"),
     tryit("7-2.t5", "Run again. Click a picture before you click Start.", "The score must NOT change.", "If it changes, look at the code on screen 6-3.", "#cw/09/6-3", neg=True)]},
    {"box": {"title": "See it running", "fold": True, "blocks": [
      frames("F16", "The reaction test running", [
        ("f16-1", "The running reaction test part way through the countdown", "Part way through: some pictures hidden, the score and the seconds left showing.")])]}}
   ]}]}
 ]}
