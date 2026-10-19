# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 9. The reaction test
Under the title: A new form with twelve pictures, two timers and a ten-second score.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch09#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does Global.cs have reactionTestScore and reactionTestTaken?
    How: Double-click Global.cs in Solution Explorer.
    If not: Go to chapter 3, stage 3.  [button: Go there ›]
  [tick box] On frmDataEntry, does the test panel have a Take test button and a status label?
    How: Open frmDataEntry in the Design tab. Look inside the test panel.
    If not: Go to chapter 2, stage 3.  [button: Go there ›]
  [tick box] Is the data entry Load event done, so the test panel switches on after the quiz?
    How: Run the program and take the quiz. Look at the test panel.
    If not: Go to chapter 8.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. Make yours look different

### Screen ch09#2-1. Choose how YOUR reaction test will look
Every reaction test works the same way. The look of yours is YOUR choice.
[Animated picture: Four cards: shape, pictures, which boxes swap, time and speed. Each turns over to show other ideas.]  Caption: Each card shows MY choice first. Then it turns over to show other ideas.
In MY example, the red and yellow flag scores a point. The red flag and the black and white flag lose one.
Yours will be different Write YOUR four choices down now. The guide shows MY choices. You type YOURS. Do not use MY flag pictures.
[Big button at the foot: Next ›]

### Screen ch09#2-2. Put your pictures in the right folder
Your program looks for its pictures in one folder. This screen makes that folder.
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
[Big button at the foot: I've done this ✓]

## Stage 3. The reaction test form: its pictures and buttons

### Screen ch09#3-1. Add the reaction test form
The reaction test gets a form of its own. You add it the way you added the quiz.
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
    picture 3: Click Add. The new form opens in the Design tab.
Yours will be different MY title label says Safe to Swim Sprint. Give YOUR title and instructions the words YOUR test needs.
[Big button at the foot: I've done this ✓]

### Screen ch09#3-2. Add twelve picture boxes
Make one picture box with the right settings. Then make eleven more the same.
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
[Big button at the foot: I've done this ✓]

### Screen ch09#3-3. Add the score panel
Drag a panel onto the form. Then drag each control into it and set its name and Text.
[Table of controls for frmTest. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Panel | pnlReactionTestStats (the panel that holds the name, the time, the score and the Start button) | Nothing else to set
  Button | btnStart (the Start button of the test) | Text = Start
  Label | lblScore (the label that says Score:) | Text = Score: 0
  Label | lblTime (the label that counts down the seconds) | Text = 10
  Label | lblName (the label that shows the pupil's name) | Text = Name
  Button | btnHelpReactionTest (the ? button in the test panel) | Text = ?
  You should see: The last five sit inside pnlReactionTestStats. The ? button gets its code in chapter 13.
Yours will be different lblTime shows 10 because MY test lasts 10 seconds. Type the number of seconds YOU chose.
[Big button at the foot: I've done this ✓]

### Screen ch09#3-4. Add two timers
The test needs two clocks. One swaps the pictures. The other counts down the seconds.
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
STEP 1. In the Toolbox, find Timer. Drag it onto the form, twice.
  You should see: Two timers sit in a grey strip under the form, not on it.
STEP 2. Name them tmrSwap and tmrCountdown. Set the Interval of each one to 1000.
  You should see: Each timer ticks once every second. Leave Enabled unticked. The code starts them.
Yours will be different 1000 is one second. If YOUR pictures swap every 0.7 seconds, type 700 for tmrSwap.
[Big button at the foot: I've done this ✓]

## Stage 4. The code before any click

### Screen ch09#4-1. Type two lines at the top of the form's code
Double-click frmTest in Solution Explorer. Then click View along the top and click Code.
[CODE CARD. Type this. Two lines at the top]
  Where: inside the class, above the line public frmTest()
  private int CountdownValue = 10;
  private List<PictureBox> pictureboxes;
  [Line 1] The seconds left: A whole number that starts at 10. The countdown takes one off each second.
  [Line 2] Room for a list: A list that will hold all twelve picture boxes.
  MY test lasts 10 seconds. If YOU chose 15 seconds, type 15.
  [Names in this code: CountdownValue, pictureboxes]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
List<PictureBox> is a list that holds picture boxes. The next screen fills it.
[Fold-out box, closed until clicked: See where they go]
  [Picture strip: The top of frmTest's code]
    picture 1: The two lines go inside the class, above public frmTest().
[Big button at the foot: I've done this ✓]

### Screen ch09#4-2. Show the name and fill the list as the form opens
In the Design tab, double-click the title bar of frmTest. frmTest_Load appears in the code tab.
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
[Big button at the foot: I've done this ✓]

## Stage 5. What a click does

### Screen ch09#5-1. Type the first line of the click code yourself
Until now, double-clicking a button wrote the first line for you. This first line you type yourself.
sender as PictureBox is the box that was clicked. != means is not.
[CODE CARD. Type this. The click code, part 1 of 2]
  Where: under frmTest_Load, inside the class
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
Watch out Type PictureBox_Click exactly. Screen 6-2 joins all twelve boxes to this name.
[Big button at the foot: I've done this ✓]

### Screen ch09#5-2. Score the click and hide the picture
ImageLocation is the path of the picture a box shows. The @ sign keeps the path exactly as typed.
[CODE CARD. Type this. The click code, part 2 of 2]
  Where: under part 1, inside PictureBox_Click
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
[Big button at the foot: I've done this ✓]

## Stage 6. Start, swap, count down

### Screen ch09#6-1. Give every box a starting picture
In the Design tab, double-click the Start button. Then give each box its first picture.
[CODE CARD. Type this. The Start button, part 1 of 2]
  Where: between the curly brackets of btnStart_Click
  [grey, already there] private void btnStart_Click(object sender, EventArgs e)
  [grey, already there] {
      pbx1.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx2.ImageLocation = @"Images\BlackAndWhiteFlag.jpeg";
      pbx3.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx4.ImageLocation = @"Images\RedFlag.jpeg";
      pbx5.ImageLocation = @"Images\RedAndYellowFlag.jpeg";
      pbx6.ImageLocation = @"Images\BlackAndWhiteFlag.jpeg";
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] The first six boxes: Each box gets the path of its first picture. Winners and losers are mixed.
  MY pictures are three flags. Type YOUR file names, exactly as you saved them in Images.
  [Names in this code: pbx1, pbx2, pbx3, pbx4, pbx5, pbx6]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pbx1 and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch09#6-2. Join the clicks and start the clocks
foreach does the same thing once for each box in the list. .Start() sets a timer ticking.
[Animated picture: A loop card on the left. One by one, each of the twelve boxes lights up with a spark.]  Caption: The loop tells every box: when you are clicked, run PictureBox_Click.
[CODE CARD. Type this. The Start button, part 2 of 2]
  Where: under part 1, inside btnStart_Click
  
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
  [Names in this code: pictureboxes, PictureBox_Click, tmrSwap, tmrCountdown, btnStart]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tmrSwap and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch09#6-3. Swap the pictures every tick
In the Design tab, double-click tmrSwap in the grey strip. Its tick code appears.
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
[Big button at the foot: I've done this ✓]

### Screen ch09#6-4. Count down one second at a time
In the Design tab, double-click tmrCountdown. -- takes one off. .Stop() stops a timer.
[CODE CARD. Type this. The countdown timer, part 1 of 2]
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
Watch out The curly bracket of the if stays open here. Part 2 closes it.
[Big button at the foot: I've done this ✓]

### Screen ch09#6-5. Show the score and go back to the data entry form
Still inside the if. These lines run once, when the seconds left reach zero.
[CODE CARD. Type this. The countdown timer, part 2 of 2]
  Where: under part 1, inside tmrCountdown_Tick
  
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
[Big button at the foot: I've done this ✓]

## Stage 7. Getting there, and Try it

### Screen ch09#7-1. Open the reaction test from the data entry form
Open frmDataEntry in the Design tab. Double-click the Take test button.
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
[Big button at the foot: I've done this ✓]

### Screen ch09#7-2. Try your reaction test
Run your program, log in, enter the details and take the quiz. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Take test.
    How: The reaction test opens with your name on it.
    If not: Look at screens 7-1 and 4-2.  [button: Go there ›]
  [tick box] Must happen. Click Start.
    How: Twelve pictures appear. The boxes you chose swap every tick.
    If not: Look at screens 6-1 and 6-3.  [button: Go there ›]
  [tick box] Must happen. Click a winning picture, then a losing one.
    How: The score goes up by one, then down by one. Each picture hides.
    If not: Look at screen 5-2.  [button: Go there ›]
  [tick box] Must happen. Wait for the time to reach zero.
    How: A message shows the score. The data entry form comes back with the group panel switched on.
    If not: Look at screen 6-5.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Click a picture before you click Start.
    How: The score must NOT change.
    If not: If it changes, look at screen 6-2.  [button: Go there ›]
[Fold-out box, closed until clicked: See it running]
  [Picture strip: The reaction test running]
    picture 1: Part way through: some pictures hidden, the score and the seconds left showing.
[Big button at the foot: Chapter 9 is done ✓]
