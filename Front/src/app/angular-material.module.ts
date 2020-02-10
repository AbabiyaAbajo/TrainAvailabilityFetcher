import { NgModule } from '@angular/core';

import {
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
} from '@angular/material';

@NgModule({
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
    ]
})

export class AngularMaterialModule { }
