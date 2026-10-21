# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 9. The reaction test
Under the title: A new form with twelve pictures, two timers and a ten-second score.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 7. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 7. You are checking the parts this chapter needs"

### Screen ch09#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does Global.cs have reactionTestScore and reactionTestTaken?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, part 3.  [button: Go there ›]
  [tick box] On frmDataEntry, does the test panel have a Take test button and a status label?
    How: Open frmDataEntry in the Design tab. Look inside the test panel.
    If not: Go to chapter 2, part 3.  [button: Go there ›]
  [tick box] Is the data entry Load event done, so the test panel switches on after the quiz?
    How: Run the program and take the quiz. Look at the test panel.
    If not: Go to chapter 8.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 7. Make yours look different
Banner at the top of every screen in this part: "Part 2 of 7. You are making your look and your pictures"

### Screen ch09#2-0. Choose your own look and save your pictures
[Opening screen of this part, one card]
Every reaction test works the same way underneath. The shape, the pictures and the timing are YOUR choices.
When it works, your four choices are written down. Your pictures sit in the Images folder.
[Big button at the foot: Next ›]

### Screen ch09#2-1. Choose how YOUR reaction test will look
Every reaction test works the same way, but the look of yours is YOUR choice.
[Animated picture: Four cards: shape, pictures, which boxes swap, time and speed. Each turns over to show other ideas.]  Caption: Each card shows MY choice first, then turns over to show other ideas.
In MY example, the red and yellow flag scores a point. The red flag and the black and white flag lose one.
Line above the big button: Done when you have read all four cards
[Big button at the foot: Next ›]

### Screen ch09#2-2. Write your four choices down
Decide your shape, your pictures, which boxes swap, and your time and speed.
Yours will be different Write YOUR four choices down now. The guide shows MY choices. You type YOURS. Do not use MY flag pictures.
Line above the big button: Done when your four choices are written down
[Big button at the foot: Next ›]

### Screen ch09#2-3. Put your pictures in the right folder
Your program looks for its pictures in one folder, and this screen makes that folder.
STEP 1. In Solution Explorer, right-click your project's name. Click Open Folder in File Explorer.
  You should see: File Explorer opens on your project's folder.
STEP 2. Double-click the bin folder. Then double-click the Debug folder.
  You should see: You can see the files of your program.
  If it goes wrong There is no bin folder. -> Run the program once with the green arrow, then look again.
STEP 3. Make a new folder here. Name it Images.
  You should see: A folder called Images sits inside Debug.
STEP 4. Find two or three small pictures on the web. Save them in Images as .jpeg or .png files.
  You should see: Your pictures are in Images, each with a short name.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Find the Debug folder]
    picture 1: Right-click the project. Click Open Folder in File Explorer.
    picture 2: Double-click bin.
    picture 3: Double-click Debug.
    picture 4: Make a new folder called Images here.
Watch out MY pictures are RedAndYellowFlag.jpeg, RedFlag.jpeg and BlackAndWhiteFlag.jpeg. Write down YOUR exact file names.
Line above the big button: Done when your pictures are inside Images, inside Debug, inside bin
[Big button at the foot: I've done this ✓]

## Part 3 of 7. The reaction test form: its pictures and buttons
Banner at the top of every screen in this part: "Part 3 of 7. You are making the reaction test form"

### Screen ch09#3-0. Make the reaction test form
[Opening screen of this part, one card]
Nothing works yet. This part only lays the form out, the way you laid out the quiz form.
When it works, frmTest has twelve picture boxes, a score panel and two timers under it.
[Big button at the foot: Next ›]

### Screen ch09#3-1. Add the reaction test form
The reaction test gets a form of its own, added the way you added the quiz.
STEP 1. Click the Project menu along the top. Click the line that starts Add Form.
  You should see: A box opens with Form picked in its list.
STEP 2. In the Name box at the bottom, type frmTest.cs. Click Add.
  You should see: frmTest opens in the Design tab. It is empty.
STEP 3. Drag two labels onto the top of the form. Name them lblSafeToSwimSprint and lblInstructions.
  You should see: Two labels sit at the top of frmTest.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a new form]
    picture 1: Open the Project menu. Click the line that starts Add Form.
    picture 2: Form is picked. Type the form's name in the Name box.
    picture 3: Click Add. The new form opens in the Design tab. My picture says frmTemp. Yours shows the name you typed.
Yours will be different MY title label says Safe to Swim Sprint. Give YOUR title and instructions the words YOUR test needs.
Line above the big button: Done when frmTest is in Solution Explorer with its two labels on it
[Big button at the foot: I've done this ✓]

### Screen ch09#3-2. Add twelve picture boxes
Make one picture box with the right settings, then make eleven more the same.
STEP 1. Drag one PictureBox from the Toolbox onto the form.
  You should see: A square picture box sits on the form.
STEP 2. In Properties, set SizeMode to StretchImage. Set its Size, for example 100, 100.
  You should see: The picture box is the size you want.
STEP 3. Right-click the picture box and click Copy. Right-click the form and click Paste.
  You should see: A second picture box appears. Do this until there are twelve.
STEP 4. Drag them into YOUR shape. Name them pbx1 to pbx12, left to right, row by row.
  You should see: Twelve picture boxes, pbx1 at the top left.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Give a control its name]
    picture 1: Click the control once. Little squares appear round it.
    picture 2: In Properties, find the word Name. It is near the top of the list.
    picture 3: Type the new name and press Enter.
Watch out Name them in reading order. The code on later screens uses these twelve names.
Line above the big button: Done when twelve picture boxes named pbx1 to pbx12 sit on frmTest
[Big button at the foot: I've done this ✓]

### Screen ch09#3-3. Add the score panel
Drag a panel onto the form, then drag each control in the table into it.
[Table of controls for frmTest. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Panel | pnlReactionTestStats (the panel that holds the name, the time, the score and the Start button) | Nothing else to set
  Button | btnStart (the Start button of the test) | Text = Start
  Label | lblScore (the label that says Score:) | Text = Score: 0
  Label | lblTime (the label that counts down the seconds) | Text = 10
  Label | lblName (the label that shows the pupil's name) | Text = Name
  Button | btnHelpReactionTest (the ? button in the test panel) | Text = ?
  You should see: The last five sit inside pnlReactionTestStats. The ? button gets its code in chapter 13.
Yours will be different lblTime shows 10 because MY test lasts 10 seconds. Type the number of seconds YOU chose.
Line above the big button: Done when the score panel holds every control in the table with its name set
[Big button at the foot: I've done this ✓]

### Screen ch09#3-4. Meet the two timers
The test needs two clocks: one swaps the pictures and the other counts the seconds down.
Eleven new things in this chapter. Click any marked word to see what it means.
  Timer = A control you cannot see that ticks on its own.
  Interval = The gap between ticks, in thousandths of a second.
  List<PictureBox> = A list that holds picture boxes.
  sender as PictureBox = The picture box that was clicked.
  != = Is not.
  ImageLocation = The path of the picture it shows.
  @"Images\…" = Take this path exactly as typed.
  foreach = Do this once for each thing in the list.
  .Start() = Set the timer ticking.
  -- = Take one off.
  .Stop() = Stop the timer ticking.
Line above the big button: Done when you have read what the two timers do
[Big button at the foot: I've done this ✓]

### Screen ch09#3-5. Add two timers
Timers live in the grey strip under the form, not on it.
STEP 1. In the Toolbox, find Timer. Drag it onto the form, twice.
  You should see: Two timers sit in a grey strip under the form, not on it.
STEP 2. Name them tmrSwap and tmrCountdown. Set the Interval of each one to 1000.
  You should see: Each timer ticks once every second. Leave Enabled unticked. The code starts them.
Yours will be different 1000 is one second. If YOUR pictures swap every 0.7 seconds, type 700 for tmrSwap.
Line above the big button: Done when tmrSwap and tmrCountdown sit under the form with Interval 1000
[Big button at the foot: I've done this ✓]

## Part 4 of 7. The code before any click
Banner at the top of every screen in this part: "Part 4 of 7. You are making the code as the form opens"

### Screen ch09#4-0. Type the code that runs as the test form opens
[Opening screen of this part, one card]
The Load event shows the pupil's name and puts all twelve picture boxes into one list. Later code uses that list.
When it works, two new lines sit at the top and frmTest_Load has eight lines.
[Big button at the foot: Next ›]

### Screen ch09#4-1. Type two lines at the top of the form's code
Double-click frmTest in Solution Explorer, then click View along the top and click Code.
[CODE CARD. Type this. Two lines at the top]
  Where: near the top, above the line public frmTest()
  private int CountdownValue = 10;
  private List<PictureBox> pictureboxes;
  [Line 1] The seconds left: A whole number that starts at 10. The countdown takes one off each second.
  [Line 2] Room for a list: A list that will hold all twelve picture boxes.
  MY test lasts 10 seconds. If YOU chose 15 seconds, type 15.
  [Names in this code: CountdownValue, pictureboxes]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
List<PictureBox> is a list that holds picture boxes. The next screen fills it.
[Fold-out box, closed until clicked: See where they go]
  [Picture strip: The top of frmTest's code]
    picture 1: The two lines go near the top, above public frmTest().
Line above the big button: Done when the two lines are typed above public frmTest() and have no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#4-2. Fill the list as the form opens
In the Design tab, double-click the title bar of frmTest to make frmTest_Load appear.
[Fold-out box, closed until clicked: See the list as a picture]
  [Animated picture: Twelve small boxes named pbx1 to pbx12 jump one by one into a single card called pictureboxes.]  Caption: All twelve boxes go into one list called pictureboxes.
[CODE CARD. Type this. The Load event of frmTest]
  Where: between the curly brackets of frmTest_Load
  [grey, already there] private void frmTest_Load(object sender, EventArgs e)
  [grey, already there] {
      lblName.Text = Global.firstname + " " + Global.surname;
      pictureboxes = new List<PictureBox>() 
      {
          pbx1, pbx2, pbx3, pbx4, pbx5, pbx6, pbx7, pbx8, pbx9, pbx10, pbx11, pbx12
      };
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Line 3] The name: The first name, a space, then the surname from Global.cs.
  [Lines 4 to 7] The list: A new list, and the twelve boxes inside its curly brackets.
  [Line 8] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: lblName, Global.firstname, Global.surname, pictureboxes, pbx1, pbx2, pbx3, pbx4, pbx5, pbx6, pbx7, pbx8, pbx9, pbx10, pbx11, pbx12]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblName and picking it from the list]
Line above the big button: Done when lines 1 to 8 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 5 of 7. What a click does
Banner at the top of every screen in this part: "Part 5 of 7. You are making the click code"

### Screen ch09#5-0. Make one piece of code for every picture click
[Opening screen of this part, one card]
Normally each button gets its own click code. Here one piece of code serves all twelve boxes.
When it works, PictureBox_Click has 17 lines. A click scores a point or loses one, then hides the picture.
[Big button at the foot: Next ›]

### Screen ch09#5-1. Type the first line of the click code yourself
Until now a double-click wrote the first line for you, but this one you type yourself.
sender as PictureBox is the box that was clicked. != means is not.
[CODE CARD. Type this. The click code: code 1 of 2]
  Where: under the last curly bracket of frmTest_Load
  private void PictureBox_Click(object sender, EventArgs e)
  {
      PictureBox clickedPicturebox = sender as PictureBox;
      if (clickedPicturebox != null)
      {
  [Lines 1 to 2] The first line: Type the whole line and the curly bracket yourself. No double-click makes this one.
  [Line 3] Which box was clicked?: sender is the box that was clicked. as PictureBox treats it as a picture box.
  [Lines 4 to 5] Only if a box was clicked: null means nothing. The lines below run only when there is a box.
  [Names in this code: PictureBox_Click, clickedPicturebox]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of clickedPicturebox and picking it from the list]
Watch out Type PictureBox_Click exactly. Screen 6-3 joins all twelve boxes to this name.
Line above the big button: Done when lines 1 to 5 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#5-2. Score the click and hide the picture
ImageLocation is the path of the picture a box shows.
The @ sign keeps the path exactly as typed.
[CODE CARD. Type this. The click code: code 2 of 2]
  Where: under code 1, inside PictureBox_Click
          if (clickedPicturebox.ImageLocation == @"Images\RedAndYellowFlag.jpeg")
          {
              Global.reactionTestScore += 1;
          }
          else
          {
              Global.reactionTestScore -= 1;
          }
          lblScore.Text = "Score:" + Global.reactionTestScore.ToString();
          clickedPicturebox.Visible = false;
      }
  }
  [Lines 6 to 13] Win or lose a point: If the box shows the winning picture, add one. Otherwise take one off.
  [Lines 14 to 15] Show the score, hide the box: The score turns into words for lblScore. The clicked box hides.
  [Lines 16 to 17] Close both curly brackets: The first closes the if. The last ends the click code.
  MY winning picture is RedAndYellowFlag.jpeg. Type YOUR winning picture's file name, exactly as you saved it.
  [Names in this code: clickedPicturebox, Global.reactionTestScore, lblScore]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblScore and picking it from the list]
Line above the big button: Done when lines 6 to 17 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 6 of 7. Start, swap, count down
Banner at the top of every screen in this part: "Part 6 of 7. You are making the Start button and two timers"

### Screen ch09#6-0. Make the Start button and the two timers work
[Opening screen of this part, one card]
Start fills the boxes, joins the clicks and starts both clocks. One clock swaps pictures, the other counts down.
When it works, the test runs for YOUR seconds, shows the score and goes back.
[Big button at the foot: Next ›]

### Screen ch09#6-1. Give every box a starting picture
In the Design tab, double-click the Start button.
Each of the twelve boxes gets the path of its first picture, winners and losers mixed.
[CODE CARD. Type this. The Start button: code 1 of 2]
  Where: between the curly brackets of btnStart_Click
  [grey, already there] private void btnStart_Click(object sender, EventArgs e)
  [grey, already there] {
      pbx1.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx2.ImageLocation = @"Images\BlackAndWhiteFlag.jpeg";
      pbx3.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx4.ImageLocation = @"Images\RedFlag.jpeg";
      pbx5.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx6.ImageLocation = @"Images\BlackAndWhiteFlag.jpeg";
      pbx7.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx8.ImageLocation = @"Images\RedFlag.jpeg";
      pbx9.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx10.ImageLocation = @"Images\BlackAndWhiteFlag.jpeg";
      pbx11.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx12.ImageLocation = @"Images\RedFlag.jpeg";
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 14] All twelve boxes: Each box gets the path of its first picture. Winners and losers are mixed.
  MY pictures are three flags. Type YOUR file names, exactly as you saved them in Images.
  [Names in this code: pbx1, pbx2, pbx3, pbx4, pbx5, pbx6, pbx7, pbx8, pbx9, pbx10, pbx11, pbx12]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pbx1 and picking it from the list]
Line above the big button: Done when lines 1 to 14 are typed with YOUR twelve file names and no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#6-2. See the loop join every box to the click code
foreach does the same thing once for each box in the list.
[Animated picture: A loop card on the left. One by one, each of the twelve boxes lights up with a spark.]  Caption: The loop tells every box: when you are clicked, run PictureBox_Click.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: I've done this ✓]

### Screen ch09#6-3. Join the clicks and start the clocks
.Start() sets a timer ticking, and Start then switches itself off.
[CODE CARD. Type this. The Start button: code 2 of 2]
  Where: under code 1, inside btnStart_Click
  
      foreach (PictureBox pb in pictureboxes)
      {
          pb.Click += new EventHandler(PictureBox_Click);
      }
      tmrSwap.Start();
      tmrCountdown.Start();
      btnStart.Enabled = false;
  [grey, already there] }
  [Lines 15 to 19] Join every box to the click code: An empty line. Then, for each box in the list, a click runs PictureBox_Click.
  [Lines 20 to 22] Start the clocks: Both timers start. Start switches itself off, so it cannot be clicked twice.
  [Line 23] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pictureboxes, pb, PictureBox_Click, tmrSwap, tmrCountdown, btnStart]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tmrSwap and picking it from the list]
Line above the big button: Done when lines 15 to 23 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#6-4. Swap the pictures every tick
In the Design tab, double-click tmrSwap in the grey strip to open its tick code.
[CODE CARD. Type this. The swap timer]
  Where: between the curly brackets of tmrSwap_Tick
  [grey, already there] private void tmrSwap_Tick(object sender, EventArgs e)
  [grey, already there] {
      if(pbx4.ImageLocation == @"Images\RedFlag.jpeg")
      {
          pbx4.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      }
      else
      {
          pbx4.ImageLocation = @"Images\RedFlag.jpeg";
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 10] One box swaps: If pbx4 shows the red flag, it gets the winner. Otherwise it gets the red flag.
  MY swaps are between two flags. Use YOUR winning picture and one of YOUR losing pictures.
  [Names in this code: pbx4]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pbx4 and picking it from the list]
Line above the big button: Done when lines 1 to 10 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#6-5. Count down one second at a time
In the Design tab, double-click tmrCountdown in the grey strip.
-- takes one off, and .Stop() stops a timer.
[CODE CARD. Type this. The countdown timer: code 1 of 2]
  Where: between the curly brackets of tmrCountdown_Tick
  [grey, already there] private void tmrCountdown_Tick(object sender, EventArgs e)
  [grey, already there] {
      CountdownValue--;
      lblTime.Text = CountdownValue.ToString();
      if(CountdownValue == 0)
      {
          tmrCountdown.Stop();
          tmrSwap.Stop();
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] One second less: Take one off the seconds left. Show the new number in lblTime.
  [Lines 5 to 8] At zero, stop both clocks: When the seconds left reach 0, both timers stop.
  [Names in this code: CountdownValue, lblTime, tmrCountdown, tmrSwap]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of lblTime and picking it from the list]
Watch out The curly bracket of the if stays open here. Code 2 closes it.
Line above the big button: Done when lines 1 to 8 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#6-6. Show the score and go back
Still inside the if, these lines run once, when the seconds left reach zero.
[CODE CARD. Type this. The countdown timer: code 2 of 2]
  Where: under code 1, inside tmrCountdown_Tick
  
          MessageBox.Show("Time up! Your Score is: " +
          Global.reactionTestScore.ToString());
          Global.reactionTestTaken = true;
  
          this.Close();
          new frmDataEntry().Show();
      }
  [grey, already there] }
  [Lines 9 to 12] The score, and the test is taken: An empty line. A message shows the score. Global.cs records the test as taken.
  [Lines 13 to 16] Go back: An empty line. This form closes and a new data entry form opens. Then the if closes.
  [Line 17] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: Global.reactionTestScore, Global.reactionTestTaken, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.reactionTestTaken and picking it from the list]
Line above the big button: Done when lines 9 to 17 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 7 of 7. Getting there, and Try it
Banner at the top of every screen in this part: "Part 7 of 7. You are testing the Take test button, then a try"

### Screen ch09#7-0. Open the test from data entry, then try it
[Opening screen of this part, one card]
Take test closes the data entry form and opens frmTest. Take quiz did the same in chapter 6.
When it works, every row on the try screen is ticked.
[Big button at the foot: Next ›]

### Screen ch09#7-1. Open the reaction test from the data entry form
Open frmDataEntry in the Design tab and double-click the Take test button.
[CODE CARD. Type this. The Take test button]
  Where: between the curly brackets of btnTakeTest_Click
  [grey, already there] private void btnTakeTest_Click(object sender, EventArgs e)
  [grey, already there] {
      //closes frmDataEntry and loads frmTest
      this.Close();
      new frmTest().Show();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Swap to the test: A note for you. This form closes, then a new reaction test form opens.
  [Line 6] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: frmTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmTest and picking it from the list]
Line above the big button: Done when lines 1 to 6 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch09#7-2. Try your reaction test
Run your program, log in, enter the details, take the quiz, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Take test.
    How: The reaction test opens with your name on it.
    If not: Look at the code on screens 7-1 and 4-2.  [button: Go there ›]
  [tick box] Must happen. Click Start.
    How: Twelve pictures appear. The boxes you chose swap every tick.
    If not: Look at the code on screens 6-1 and 6-4.  [button: Go there ›]
  [tick box] Must happen. Click a winning picture, then a losing one.
    How: The score goes up by one, then down by one. Each picture hides.
    If not: Look at the code on screen 5-2.  [button: Go there ›]
  [tick box] Must happen. Wait for the time to reach zero.
    How: A message shows the score. The data entry form comes back.
    If not: Look at the code on screen 6-6.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Click a picture before you click Start.
    How: The score must NOT change.
    If not: If it changes, look at the code on screen 6-3.  [button: Go there ›]
[Fold-out box, closed until clicked: See it running]
  [Picture strip: The reaction test running]
    picture 1: Part way through: some pictures hidden, the score and the seconds left showing.
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 9 is done ✓]

# Chapter 10. Work out the group
Under the title: Three scores become one group, worked out by a piece of code you name yourself.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 4. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 4. You are checking the parts this chapter needs"

### Screen ch10#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is the data entry Load event done, so the group panel switches on after the test?
    How: Run the program. Take the quiz and the test. Look at the group panel.
    If not: Go to chapter 8.  [button: Go there ›]
  [tick box] Does the group panel have a result box and a Calculate button?
    How: Open frmDataEntry in the Design tab. Look inside the group panel.
    If not: Go to chapter 2, part 3.  [button: Go there ›]
  [tick box] Does Global.cs have assignedGroup?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, part 3.  [button: Go there ›]
  [tick box] Is YOUR task sheet open at the page with the bands and the group names?
    How: Find the page that says which scores give which group.
    If not: Ask your teacher for the task sheet.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 4. Your own piece of code, with a name you choose
Banner at the top of every screen in this part: "Part 2 of 4. You are making CalculateGroup, your own code"

### Screen ch10#2-0. Make CalculateGroup, your own piece of code
[Opening screen of this part, one card]
Until now every piece of code came from a double-click. This one you type from its first line, and you choose its name.
When it works, CalculateGroup sits at the bottom of frmDataEntry's code, 18 lines long.
[Big button at the foot: Next ›]

### Screen ch10#2-1. Meet the two new words
Until now, each method came from double-clicking a button.
This one you write by hand.
You choose its name. That makes it a user-defined method.
Two new words in this chapter. Click a marked word to see what it means.
  method = A named piece of code that runs when it is asked to.
  user-defined method = A method you write and name yourself.
Line above the big button: Done when you have read the two words
[Big button at the foot: Next ›]

### Screen ch10#2-2. See three bands go in and one group come out
This picture shows CalculateGroup at work.
[Animated picture: Three numbers, 3, 2 and 3, drop into a box called CalculateGroup. The word Advanced comes out.]  Caption: Three bands go in. One group comes out.
Watch out The button code in part 3 works out the three bands. Then it asks CalculateGroup for the group.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: Next ›]

### Screen ch10#2-3. Type the first line, the total and the first group
Scroll to the bottom of frmDataEntry's code.
Click the empty line above the last two curly brackets.
[CODE CARD. Type this. CalculateGroup: code 1 of 2]
  Where: above the last two curly brackets of frmDataEntry's code
  private string CalculateGroup(int first, int second, int third)
  {
      int total = first + second + third;
  
      if (total <= 4)
      {
          return "Weak";
      }
  [Lines 1 to 2] The first line, typed by you: private means only this form uses it. string means it hands back words. Then its name and three whole numbers coming in.
  [Lines 3 to 4] Add them up: The three numbers are added into total. Then an empty line.
  [Lines 5 to 8] Four or less is Weak: If the total is 4 or less, return hands back the word Weak.
  MY bands and group names come from MY task. Use the numbers and names on YOUR task sheet.
  [Names in this code: CalculateGroup, first, second, third, total]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out No double-click makes this first line. Type every word of it yourself.
Line above the big button: Done when lines 1 to 8 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#2-4. Hand back the other two groups
Each return hands the answer back to the code that asked for it.
[CODE CARD. Type this. CalculateGroup: code 2 of 2]
  Where: under code 1, inside CalculateGroup
      else if (total <= 7)
      {
          return "Intermediate";
      }
      else
      {
          return "Advanced";
      }
  
  }
  [Lines 9 to 12] Seven or less is Intermediate: Otherwise, if the total is 7 or less, hand back Intermediate.
  [Lines 13 to 16] Anything more is Advanced: Every other total hands back Advanced.
  [Lines 17 to 18] Close it: An empty line, then the curly bracket that ends CalculateGroup.
  MY numbers are 4 and 7, and MY groups are Weak, Intermediate and Advanced. Type the ones on YOUR task sheet.
  [Names in this code: total]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 9 to 18 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 3 of 4. The Calculate button
Banner at the top of every screen in this part: "Part 3 of 4. You are making the Calculate button"

### Screen ch10#3-0. Make the Calculate button work out the group
[Opening screen of this part, one card]
A band is 1, 2 or 3. The quiz score, the test score and the average each get one from YOUR task sheet.
When it works, Calculate shows the group in its box and the group panel goes grey.
[Big button at the foot: Next ›]

### Screen ch10#3-1. Stop if anything is not done yet
In the Design tab, double-click the Calculate button in the group panel.
[CODE CARD. Type this. The Calculate button: code 1 of 7]
  Where: between the curly brackets of btnCalculateSwimmingGroup_Click
  [grey, already there] private void btnCalculateSwimmingGroup_Click(object sender, EventArgs e)
  [grey, already there] {
      if (Global.quizTaken == false || Global.reactionTestTaken == false || Global.averageCalculated == false || pnlPupilDetails.Enabled == true)
  
      {
          MessageBox.Show("Not all values have been saved");
          return;
      }
  
      //The maximum score that can be achieved for the Quiz is 5
      //The maximum score that can be achieved for the Reaction Test is 8
      //There are three score categories; 1,2, and 3 (basic, good and excellent)
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] Not everything done? Stop here: If any of the four is not done, a message shows. Then the code stops.
  [Lines 9 to 12] Notes for you: An empty line, then three notes about the scores. They do not run.
  [Names in this code: Global.quizTaken, Global.reactionTestTaken, Global.averageCalculated, pnlPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlPupilDetails and picking it from the list]
Watch out Line 3 is one long line. Keep it on one line in Visual Studio.
Line above the big button: Done when lines 1 to 12 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-2. Make room for three bands
A band is 1, 2 or 3, and each score gets one on the next screens.
[CODE CARD. Type this. The Calculate button: code 2 of 7]
  Where: under code 1, inside btnCalculateSwimmingGroup_Click
  
  
      else
      {
          int quizCategory = 0;
          int reactionTestCategory = 0;
          int swimLengthsCategory = 0;
  
          //deciding the quiz category
  [Lines 13 to 16] Otherwise, carry on: Two empty lines, then else and its curly bracket.
  [Lines 17 to 19] Three bands to fill: One whole number for each band. Each starts at 0.
  [Lines 20 to 21] A note for the quiz: An empty line, then a note. The quiz band comes next.
  [Names in this code: quizCategory, reactionTestCategory, swimLengthsCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 13 to 21 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-3. Give the quiz score a band
These ifs have the same shape as CalculateGroup, but this time each answer is a band.
[CODE CARD. Type this. The Calculate button: code 3 of 7]
  Where: under code 2, inside btnCalculateSwimmingGroup_Click
          if (Global.quizScore <= 1)
          {
              quizCategory = 1;
          }
          else if (Global.quizScore <= 3)
          {
              quizCategory = 2;
          }
          else
          {
              quizCategory = 3;
          }
  [Lines 22 to 25] One or less is band 1: If the quiz score is 1 or less, the quiz band is 1.
  [Lines 26 to 29] Three or less is band 2: Otherwise, if it is 3 or less, the quiz band is 2.
  [Lines 30 to 33] Anything more is band 3: Every other score makes the quiz band 3.
  MY quiz is out of 5, so MY numbers are 1 and 3. YOUR task sheet gives YOURS.
  [Names in this code: Global.quizScore, quizCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 22 to 33 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-4. Give the test score a band
The test band has the same shape, and this screen does bands 1 and 2.
[CODE CARD. Type this. The Calculate button: code 4 of 7]
  Where: under code 3, inside btnCalculateSwimmingGroup_Click
  
          //deciding the reaction test category
          if (Global.reactionTestScore <= 1)
          {
              reactionTestCategory = 1;
          }
          else if (Global.reactionTestScore <= 4)
          {
              reactionTestCategory = 2;
          }
  [Lines 34 to 35] A note for the test: An empty line, then a note.
  [Lines 36 to 39] One or less is band 1: If the test score is 1 or less, the test band is 1.
  [Lines 40 to 43] Four or less is band 2: Otherwise, if it is 4 or less, the test band is 2.
  MY numbers are 1 and 4. Use the numbers on YOUR task sheet.
  [Names in this code: Global.reactionTestScore, reactionTestCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 34 to 43 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-5. Give the test score its last band
These lines are the last part of the test band, then a note for the average.
[CODE CARD. Type this. The Calculate button: code 5 of 7]
  Where: under code 4, inside btnCalculateSwimmingGroup_Click
          else
          {
              reactionTestCategory = 3;
  
          }
  
          //deciding the swim lengths category
  [Lines 44 to 48] Anything more is band 3: Every other score makes the test band 3. An empty line sits inside.
  [Lines 49 to 50] A note for the average: An empty line, then a note. The average band comes next.
  [Names in this code: reactionTestCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 44 to 50 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-6. Give the average a band
Look closely at the first line: it says less than 4, not 4 or less.
[CODE CARD. Type this. The Calculate button: code 6 of 7]
  Where: under code 5, inside btnCalculateSwimmingGroup_Click
          if (Global.average < 4)
          {
              swimLengthsCategory = 1;
          }
          else if (Global.average <= 7)
          {
              swimLengthsCategory = 2;
          }
          else
          {
              swimLengthsCategory = 3;
          }
  [Lines 51 to 54] Under 4 is band 1: If the average is less than 4, the average band is 1.
  [Lines 55 to 58] Seven or less is band 2: Otherwise, if it is 7 or less, the average band is 2.
  [Lines 59 to 62] Anything more is band 3: Every other average makes the band 3.
  MY numbers are 4 and 7. Use the numbers on YOUR task sheet.
  [Names in this code: Global.average, swimLengthsCategory]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 51 to 62 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch10#3-7. See the group panel go grey
After the group appears, the group panel goes grey so Calculate cannot run twice.
[Animated diagram of frmDataEntry. Panels switched on: pnlSwimmingGroup.]
  Caption: The group panel goes grey. Save comes next.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: I've done this ✓]

### Screen ch10#3-8. Ask for the group and grey out the panel
These lines ask CalculateGroup for the group, save it in Global.cs and grey the panel.
[CODE CARD. Type this. The Calculate button: code 7 of 7]
  Where: under code 6, inside btnCalculateSwimmingGroup_Click
  
          tbxSwimmingGroup.Text = CalculateGroup(reactionTestCategory, swimLengthsCategory, quizCategory);
          Global.assignedGroup = tbxSwimmingGroup.Text;
          pnlSwimmingGroup.Enabled = false;
      }
  
  
  [grey, already there] }
  [Lines 63 to 64] Ask CalculateGroup: The three bands go in. The group comes out into the box.
  [Lines 65 to 66] Remember it, grey the panel: Global.cs keeps the group. The group panel switches off.
  [Lines 67 to 69] Close the else: The end of else, then two empty lines.
  [Line 70] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: tbxSwimmingGroup, CalculateGroup, reactionTestCategory, swimLengthsCategory, quizCategory, Global.assignedGroup, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of CalculateGroup and picking it from the list]
Line above the big button: Done when lines 63 to 70 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 4. Try it
Banner at the top of every screen in this part: "Part 4 of 4. You are testing your Calculate button"

### Screen ch10#4-1. Try your Calculate button
Run your program and log in.
Enter the details, the attempts, the quiz and the test, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Calculate.
    How: A group appears in the box. The group panel goes grey.
    If not: Look at the code on screen 3-8.  [button: Go there ›]
  [tick box] Must happen. Run again. Get all 5 quiz questions right. Click 6 winning pictures. Type 8, 8 and 8 as the attempts.
    How: Click Calculate. MY bands give Advanced. YOURS give YOUR top group.
    If not: Look at the code on screens 3-3 to 3-6.  [button: Go there ›]
  [tick box] Must happen. Run again. Get 1 quiz question right. Click 1 winning picture. Type 2, 2 and 2 as the attempts.
    How: Click Calculate. MY bands give Weak. YOURS give YOUR lowest group.
    If not: Look at the code on screens 2-3 and 2-4.  [button: Go there ›]
  [tick box] Must NOT happen. After the group appears, click Calculate again.
    How: Nothing must happen, because the panel is grey.
    If not: If something happens, look at the code on screen 3-8.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 10 is done ✓]

# Chapter 11. Save the details to the file
Under the title: Put one line in the file, clear Global.cs, start again.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 7. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 7. You are checking the parts this chapter needs"

### Screen ch11#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is chapter 10 done, so a group appears when you click Calculate?
    How: Run the program. Do every part, then click Calculate.
    If not: Go to chapter 10.  [button: Go there ›]
  [tick box] Is there a Save button under the panels, named btnSaveDetails?
    How: Open frmDataEntry in the Design tab. Click the Save button and look at its Name.
    If not: Go to chapter 2, part 3.  [button: Go there ›]
  [tick box] Does Global.cs have all fourteen names?
    How: Double-click Global.cs in Solution Explorer. Count the lines that start with public static.
    If not: Go to chapter 3, part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 7. The file tools
Banner at the top of every screen in this part: "Part 2 of 7. You are making the file tools line"

### Screen ch11#2-0. Add the line that lets the form use files
[Opening screen of this part, one card]
One line at the very top of frmDataEntry's code lets this form use File. Four new words come first.
When it works, using System.IO sits under the other using lines and File is not red.
[Big button at the foot: Next ›]

### Screen ch11#2-1. Meet the four new words
Four new words come up in this chapter.
Click a marked word to see what it means.
  using System.IO = A line at the top that lets the form use the file tools.
  ~ = A wavy line. It sits between the pieces of a line, like a fence.
  Environment.NewLine = The end of a line. The next words start on a new line.
  File.AppendAllText = Adds words to the end of a file. It makes the file if it is not there.
Line above the big button: Done when you have read the four words
[Big button at the foot: Next ›]

### Screen ch11#2-2. Add the file tools line at the top
Open frmDataEntry's code and scroll to the very top.
The top lines start with the word using. Click at the end of the last one and press Enter, so a new line waits.
[CODE CARD. Type this. One line at the top]
  Where: under the other using lines, at the very top of frmDataEntry's code
  using System.IO;
  [Line 1] The file tools: It lets this form use File, which writes to a file.
  [Names in this code: System.IO]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Without using System.IO the word File goes red.
[Fold-out box, closed until clicked: See where it goes]
  [Picture strip: The using line at the top]
    picture 1: The new line sits under the other using lines.
Line above the big button: Done when using System.IO sits under the other using lines and is not red
[Big button at the foot: I've done this ✓]

## Part 3 of 7. Only when everything is done
Banner at the top of every screen in this part: "Part 3 of 7. You are making the Save button's check"

### Screen ch11#3-1. Check all five panels are off before saving
In the Design tab, double-click the Save button.
A panel is switched off when its part is done, so this if checks all five.
[CODE CARD. Type this. The Save button: code 1 of 6]
  Where: between the curly brackets of btnSaveDetails_Click
  [grey, already there] private void btnSaveDetails_Click(object sender, EventArgs e)
  [grey, already there] {
      if(pnlSwimLengths.Enabled == false && pnlReactionTest.Enabled == false && pnlQuizResult.Enabled == false && pnlPupilDetails.Enabled == false && pnlSwimmingGroup.Enabled == false)
      {
  
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Line 3] Are all five panels grey?: One long line. && means and. All five must be switched off.
  [Lines 4 to 6] Room inside: A curly bracket, then two empty lines. Code 2 goes straight after them.
  [Names in this code: pnlSwimLengths, pnlReactionTest, pnlQuizResult, pnlPupilDetails, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Line 3 is one long line. Keep it on one line in Visual Studio.
Line above the big button: Done when lines 1 to 6 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 7. Write the line to the file
Banner at the top of every screen in this part: "Part 4 of 7. You are making the line that goes in the file"

### Screen ch11#4-0. Write one line to the file
[Opening screen of this part, one card]
Two pieces of code join the details into one line and write it to the file.
When it works, one new line with ten fences sits at the end of pupilStats.txt.
[Big button at the foot: Next ›]

### Screen ch11#4-1. Join all the details into one line
Each ~ is a fence between two pieces of the line.
[CODE CARD. Type this. The Save button: code 2 of 6]
  Where: under code 1, inside the if of btnSaveDetails_Click
          //create the string with each value separated by '~'
          string record = Global.surname + "~" +
          Global.firstname + "~" +
          Global.quizScore.ToString() + "~" +
          Global.yearGroup + "~" +
          Global.gender + "~" +
          Global.average.ToString() + "~" +
          Global.attempt1.ToString() + "~" +
          Global.attempt2.ToString() + "~" +
          Global.attempt3.ToString() + "~" +
          Global.reactionTestScore.ToString() +"~" +
          Global.assignedGroup;
  [Line 7] A note: A note about the fences. It does not run.
  [Lines 8 to 12] The first five pieces: Surname, first name, quiz score, year group and gender, each followed by a ~.
  [Lines 13 to 18] The last six pieces: The average, the three attempts, the test score and the group.
  [Names in this code: record, Global.surname, Global.firstname, Global.quizScore, Global.yearGroup, Global.gender, Global.average, Global.attempt1, Global.attempt2, Global.attempt3, Global.reactionTestScore, Global.assignedGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 7 to 18 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch11#4-2. See the line that goes in the file
This picture shows the line that code 2 builds.
[Animated picture: The line Smith~Anna~4~12~F~6.33~5~6~8~5~Advanced. Each piece has its own colour and a number from 0 to 10.]  Caption: The order matters. The report reads the pieces back in this order.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: Next ›]

### Screen ch11#4-3. Write the line to the file
Environment.NewLine ends the line and File.AppendAllText adds it to the end of the file.
[CODE CARD. Type this. The Save button: code 3 of 6]
  Where: under code 2, inside the if of btnSaveDetails_Click
  
          //Append a new line so that each new record stats a new line
          record += Environment.NewLine;
  
          //Append the text to the file 'pupilStats' (creates the file if it doesn't exist)
          File.AppendAllText("pupilStats.txt", record);
  
          MessageBox.Show("Data saved successfully. \n you can enter details for another student");
  
  [Lines 19 to 21] End the line: An empty line and a note. Then the end of a line is added to record.
  [Lines 22 to 24] Write it to the file: An empty line and a note. Then record goes on the end of the file.
  [Lines 25 to 27] Say it is saved: A message tells the pupil it worked. Empty lines sit either side.
  MY file is pupilStats.txt. If YOU choose another name, type it in place of pupilStats.txt. The report needs the same name.
  [Names in this code: record, Environment.NewLine, File.AppendAllText]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 19 to 27 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 5 of 7. Clear Global.cs and start again
Banner at the top of every screen in this part: "Part 5 of 7. You are making the fresh start for the next pupil"

### Screen ch11#5-0. Make Global.cs empty and start again
[Opening screen of this part, one card]
Two pieces of code empty all fourteen names in Global.cs, then a fresh form opens.
When it works, the form closes after a save and a brand new empty one opens.
[Big button at the foot: Next ›]

### Screen ch11#5-1. Put the first seven names back to empty
Global.cs still holds this pupil's details, so clear them for the next pupil.
[CODE CARD. Type this. The Save button: code 4 of 6]
  Where: under code 3, inside the if of btnSaveDetails_Click
          //Reset the Global variables after saving the data 
          Global.surname = "";
          Global.firstname = "";
          Global.quizScore = 0;
          Global.yearGroup = "";
          Global.gender = "";
          Global.averageCalculated = false;
          Global.average = 0;
  [Line 28] A note: A note about clearing. It does not run.
  [Lines 29 to 33] Empty words: Words go back to two speech marks with nothing between them.
  [Lines 34 to 35] Back to the start: averageCalculated goes back to false. The average goes back to 0.
  [Names in this code: Global.surname, Global.firstname, Global.quizScore, Global.yearGroup, Global.gender, Global.averageCalculated, Global.average]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 28 to 35 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch11#5-2. Put the rest back and start again
Each number goes back to 0 and each true or false goes back to false.
[CODE CARD. Type this. The Save button: code 5 of 6]
  Where: under code 4, inside the if of btnSaveDetails_Click
          Global.attempt1 = 0;
          Global.attempt2 = 0;
          Global.attempt3 = 0;
          Global.reactionTestScore = 0;
          Global.reactionTestTaken = false;
          Global.quizTaken = false;
          Global.assignedGroup = "";
  
          this.Close();
          new frmDataEntry().Show();
  [Lines 36 to 42] The other seven: The attempts, the test, the two true or false names and the group.
  [Lines 43 to 45] Start again: An empty line. Then this form closes and a fresh one opens.
  [Names in this code: Global.attempt1, Global.attempt2, Global.attempt3, Global.reactionTestScore, Global.reactionTestTaken, Global.quizTaken, Global.assignedGroup, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmDataEntry and picking it from the list]
Line above the big button: Done when lines 36 to 45 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch11#5-3. See the fresh form for the next pupil
This picture shows the form after a save.
[Animated picture: The data entry form, fresh and empty, beside Global.cs.]  Caption: The file keeps the line and the form starts fresh.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: Next ›]

## Part 6 of 7. If a panel is still on, stop
Banner at the top of every screen in this part: "Part 6 of 7. You are making the stop when a part is missing"

### Screen ch11#6-1. Stop and say so when a panel is still on
When a panel is still on, this else shows a message and stops.
[CODE CARD. Type this. The Save button: code 6 of 6]
  Where: under code 5, to end the if and add the else
  
  
      }
      else
      {
          MessageBox.Show("Not all results or student data has been saved yet");
          return;
      }
  
  [grey, already there] }
  [Lines 46 to 47] Two empty lines: Two empty lines after the line that opens the fresh form.
  [Line 48] End the if: The curly bracket that ends the if. Visual Studio may have typed it already.
  [Lines 49 to 53] Not done? Say so and stop: else runs when a panel is still on. A message shows and return stops the code.
  [Line 54] An empty line: Leave one empty line here.
  [Line 55] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
Watch out Visual Studio may already have a } under line 45. Press Enter twice at the end of line 45 to push it to line 48.
Line above the big button: Done when lines 46 to 55 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 7 of 7. Try it
Banner at the top of every screen in this part: "Part 7 of 7. You are testing your Save button"

### Screen ch11#7-1. Try your Save button
Run your program, log in and do every part, then click Calculate.
Then try each row. The Find the file box under the rows shows the Debug folder.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Save.
    How: The saved message shows. Then a fresh data entry form opens.
    If not: Look at the code on screens 4-3 and 5-2.  [button: Go there ›]
  [tick box] Must happen. Stop the program. Find the Debug folder. Look for YOUR file.
    How: YOUR file is there, next to the program.
    If not: Look at the code on screen 4-3.  [button: Go there ›]
  [tick box] Must happen. Double-click YOUR file. It opens in Notepad.
    How: One line, with a ~ between each piece.
    If not: Look at the code on screen 4-1.  [button: Go there ›]
  [tick box] Must happen. Run again and save a second pupil. Open the file again.
    How: Two lines. The second pupil is on the second line.
    If not: Look at the code on screen 4-3.  [button: Go there ›]
  [tick box] Must NOT happen. Log in and click Save straight away.
    How: The not all results message shows. NO line is added to the file.
    If not: Look at the code on screens 3-1 and 6-1.  [button: Go there ›]
[Fold-out box, closed until clicked: Find the file]
  [Picture strip: Find the Debug folder]
    picture 1: Right-click the project. Click Open Folder in File Explorer.
    picture 2: Double-click bin.
    picture 3: Double-click Debug.
[Fold-out box, closed until clicked: See the file]
  [Picture strip: The file after the first save]
    picture 1: The file is in the Debug folder.
    picture 2: One line, with a ~ between each piece.
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 11 is done ✓]
