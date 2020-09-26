import styles from './styles.css'
import Gist from './gist'

const InlineCode = ({ attributes: { code }}) => <pre className={styles.inlineCode}>{code}</pre>

const template = 'https://gist.github.com/ScottORLY/49dcd868fa0127b9db5a8ff40e14d9b8.json?file='

const blog = (
<div id={styles.app}>
    <h1><i>Drive</i></h1>

    <h2>Functional Reactive Form Validation in iOS with RxSwift</h2>
    <h4>by <a href='https://github.com/ScottORLY'>Scott Orlyck</a></h4>

    <img className={styles.img} src='https://raw.githubusercontent.com/ScottORLY/drive-blog/main/src/drive.jpg' alt='Ryan Gosling with a Dispose Bag'/>
    
    <p>
        <a href='https://www.youtube.com/watch?v=KBiOF3y1W0Y'>
            <i>Drive, 2011</i>
        </a>
    </p>
    
    <h2>Introduction</h2>

    <p>
        This blog post is intended for readers with some measure of familiarity with iOS development, 
        functional reactive programming and alternative iOS architecture patterns.

        If not here are some resources to get started.
        <ul className={styles.list}>
            <li><a href='http://reactivex.io/'>ReactiveX</a></li>

            <li><a href='https://github.com/ReactiveX/RxSwift'>RxSwift</a></li>
            
            <li><a href='https://www.raywenderlich.com/34-design-patterns-by-tutorials-mvvm'>MVVM</a></li>
        </ul>
    </p>

    <h2>Why Drive?</h2>

    <p>
        SwiftUI has been getting all the love since it was announced but I want to take some time to write about the productivity benefits of functional reactive programming using RxSwift when combined with the stability of UIKit.
    </p>

    <p>
        Observables are excellent for escaping target-action, delegate based MVC patterns but even after the steep learning curve remembering tedious boilerplate and dodging footguns can be time consuming and error prone. Furthermore type inference across API boundaries
        can result in frustrating fights with the Swift compiler.
    </p>

    <p>
        An example from the RxSwift documentation is an effective 
        demonstration of the implementation complexity faced when using Rx with UIKit.
    </p>

    <Gist url={`${template}subscribe.swift`} />

    <p>
        Thankfully RxSwift provides us with some wrappers around common RxSwift UI patterns that can help simplify implementations. RxSwift calls these wrappers <a hre=''>traits</a> and today we are going to focus on the <a href="https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver">Driver</a> trait.
    </p>

    <p>
        RxSwift Traits are simple structs that implement the builder pattern to return an observable sequence guaranteed to have certain properties. The Driver trait guarantees three properties that happen to be integral to correct UI implementations: events are observed on the main thread, the observable sequence can't error out, and side effects are shared so that each subscription will share the same computational resources.
    </p>

    <Gist url={`${template}RxDrive.swift`} />

    <p className={styles.noIndent}>Let's take a closer look at a practical example.</p>

    <h2>Real Time UITextfield Validation</h2>

    <div>
        <img className={`${styles.img} ${styles.right}`} src='https://raw.githubusercontent.com/ScottORLY/drive-blog/main/src/validation.gif' />
        <div>
            <p>
                Form validation that provides the user with immediate feedback if a text field meets predefined requirements is a common UX pattern and this example will show you how you can use the Driver trait for effective results with a very small amount of clean, testable code.
            </p>

            <p>
                For the purpose of narrowing the focus of this article I won't be going over project setup, how to connect outlets in storyboards, the basics of RxSwift/RxCocoa etc. I will also be handwaving the networking, validation and network activity tracking utilities as those implementation details are outside the scope of this article. The working project source code is available <a href='https://github.com/ScottORLY/drive'>here</a> if you would like to take a closer look or test a working example on a simulator or device.
            </p>
        </div>
    </div>

    <p>
        This project will use MVVM but there are a few ground rules to help enforce seperation of concerns:
        <ol type='1' className={styles.list}>
            <li>The ViewModel can never import UIKit or reference the ViewController.</li>
            <li>The ViewModel will never subscribe to an observable.</li>
            <li>The ViewController will never directly call any methods defined on the ViewModel.</li>
        </ol>
    </p>

    <p>
        First we define inputs to the ViewModel. The initializer for our new ViewModel class below takes a pair of <InlineCode code='Driver<String>' /> for the email and password and a <InlineCode code='Driver<Void>' /> for the sign in button tap. We are not going to explicitly store references to these sequences.
    </p>

    <Gist url={`${template}init.swift`} />

    <p>
        In the ViewController we initialize the ViewModel passing in the Observables from the IBOutlets. Note the call to <InlineCode code='.asDriver()'/> to build the Drivers from the ControlEvent observables.
    </p>

    <Gist url={`${template}outlets.swift`} />

    <p>
        Next we define output properties to store the reference to the result of the operator transformations we are going to perform on the input observables.
    </p>

    <Gist url={`${template}outputs.swift`} />

    <p>
        Above we are using <InlineCode code='Driver.combineLatest' /> to combine events from the UITextField Drivers and the sign in button tap. The purpose of this is to exploit a behavior of combine latest that the result observable will not emit an event until both source observables have at least one in order to prevent displaying validation errors before user interaction. Then we <InlineCode code='.flatMapLatest' /> the combined text and tap events passing the string into our validation service's appropriate validation method and return a <InlineCode code='Driver<Validation>' /> that is stored in the output properties defined above.
    </p>

    <p>
        Close the loop by calling <InlineCode code='drive(onNext:)' /> on the output observables in the ViewController. Don't forget to put the results of the <InlineCode code='drive(onNext:)' /> calls in the <InlineCode code='bag' /> or to call <InlineCode code='bind()'/> in <InlineCode code='viewDidLoad()'/>.
    </p>

    <Gist url={`${template}bind.swift`} />

    <h2>The Getaway</h2>

    <p>
        Add two more output properties to the ViewModel. The first is <InlineCode code='signingIn: Driver<Bool>' /> to manage the state of the current request so we can disable the sign in button when a request is in-flight. The second is the output Driver for the response from the network request to sign in.
    </p>

    <Gist url={`${template}outputs1.swift`} />

    <p>
        The ViewModel snippet below is preparation to handle the sign in implementation. Compose the email and password text drivers (the inputs) with the validation result drivers (the outputs) in addition we create another Driver wrapped observable from a utility class borrowed from RxExample that provides the ability to track the activity of an observable so we can prevent the user from creating a duplicate request if one is already in-flight and the user mashes the sign in button.
    </p>

    <Gist url={`${template}combine.swift`} />

    <p>
        Finally we hook everything together, there is a lot going on here so let's break it down line by line. First call <InlineCode code='withLatestFrom()' /> with the combined inputs and outputs composed above (<InlineCode code='validated' />). Then we <InlineCode code='flatMapLatest' /> the observables composition, guard for successful validation and no requests in flight, then flatMap the observable from the network sign in request, check the response status (the example code is oversimplifed but in a real world application here is where you determine error messsages to display if for instance the response was <i>401 unauthorized</i>) and return an <InlineCode code='Observable<LoginResponse>' />, add the activity tracking and finally build the <InlineCode code='signedIn: Driver<LoginResponse>' /> output Driver. 
    </p>

    <Gist url={`${template}signedin.swift`} />

    <p>
        Now in the ViewController we use <InlineCode code='drive(onNext:)' /> to drive the state of the <InlineCode code='isEnabled' /> property of the sign in button and drive <InlineCode code='signedIn'/> to handle the result of the sign in network call. Again taking caution to use <InlineCode code='[weak self]' /> and don't forget to dispose of the result of <InlineCode code='drive' /> in the bag. 
    </p>

    <Gist url={`${template}bind1.swift`} />

    <p>
        The success state is where the application would presumbaly handle navigating elsewhere or dismissing the sign in in screen if presented modally. In a real world application the response should wrap a more informative error message that can then be displayed to the user  .
    </p>

    <h2>Test Drive</h2>

    <p>
        What about unit testing the ViewModel you ask? Simple, since all the ViewModel knows is that it needs 3 Drivers we can provide those easily. 
    </p>

    <Gist url={`${template}TestDrive.swift`} />

    <h2>In the Bag</h2>
    <p>That's the post, you can find the completed working project <a href='https://github.com/ScottORLY/drive'>here</a>. Feel free to drop some feedback or questions on <a href='https://twitter.com/orlyck'>Twitter</a> or you can go to the <a href='https://github.com/ScottORLY/drive-blog'>source</a> of this blog post itself and create an issue or pull-request. Until next time.</p>
</div>
)

document.body.appendChild(blog)