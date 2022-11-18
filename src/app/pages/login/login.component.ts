import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, UntypedFormBuilder, Validators, FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AppGlobal } from '../../services/app.global';
import { ApiService } from '../../services/api.service';
import { GvarService } from 'src/app/services/gvar.service';
import { UserModel, TokenRequestModel } from './model/users'
import { Locations } from './model/locations';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    @ViewChild('langInput') langInput: ElementRef;
    public captchaIsLoaded = false;
    public captchaSuccess = false;
    public captchaIsExpired = false;
    public captchaResponse?: string;
    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type: 'image' | 'audio';
    public keys = "6LfMNLMeAAAAANkDM1rQ79Ajv6avm36dUrTyDQvo"
    public router: Router;
    public loginForm: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    locations: any = [];
    TokenRequestModel: TokenRequestModel;
    Locations: Locations[];
    loginViewModel: UserModel
    clicked = false;
    InvalidLogin: boolean;
    errorMessage: string;
    Roles: any = [];
    returnUrl: string;
    isReadOnly = true;
    validForm: boolean = false;
    constructor(router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private config: AppGlobal,
        private API: ApiService,
        private GV: GvarService,
        private activatedRoute: ActivatedRoute,) {
        this.router = router;
        this.TokenRequestModel = new TokenRequestModel();
        this.loginViewModel = new UserModel();
        this.Locations = [];
    }

    ngOnInit() {
        this.InitializeForm();
    }

    InitializeForm() {
        this.loginForm = this.fb.group({
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required,])],
            'recaptcha': ['', Validators.compose([Validators.required,])]
        });
    }

    onSubmit(): void {
        this.GV.locationID = 1;
        this.clicked = true;
        this.GV.G_IsRunning = false;
        this.loginForm.disable({ emitEvent: true });
        this.TokenRequestModel.ClientId = "";
        this.TokenRequestModel.Grant_Type = "password";
        this.TokenRequestModel.Refresh_Token = "";
        this.TokenRequestModel.Username = this.loginForm.get('username').value;
        this.TokenRequestModel.Password = this.loginForm.get('password').value;
        this.API.LoginUser(this.config.TOKEN_AUTH, this.TokenRequestModel).subscribe({
            next: (data) => {
                localStorage.setItem('access_token', data.Access_Token);
                localStorage.setItem('name', data.UserName);
                localStorage.setItem('userID', data.UserId);
                this.toastr.success('Login Successfully ', 'Success');
                this.router.navigate(['/view/index']);
            },
            error: (error) => {
                this.InvalidLogin = true;
                this.clicked = false;
                this.loginForm.enable({ emitEvent: true });
                if (error.error.Message != undefined) {
                    this.toastr.error(error.error.Message, 'Error');
                }
                else {
                    this.toastr.error('Network Error', 'Error');
                }
            }
        });


    }
    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }
    handleSuccess(data) {
        console.log(data);
    }
}