import * as React from "react";
import MutationTable from "../../../shared/components/mutationTable/MutationTable";
import {IColumnDefMap} from "../../../shared/components/enhancedReactTable/IEnhancedReactTableProps";
import ProteinChangeColumnFormatter from "./column/ProteinChangeColumnFormatter";
import TumorColumnFormatter from "./column/TumorColumnFormatter";
import AlleleFreqColumnFormatter from "./column/AlleleFreqColumnFormatter";
import AlleleCountColumnFormatter from "./column/AlleleCountColumnFormatter";
import { Mutation } from "../../../shared/api/CBioPortalAPI";


export interface IMutationInformationContainerProps {
    mutations: Array<Mutation>;
    sampleOrder:string[];
    sampleColors:{ [s:string]: string};
    sampleLabels:{ [s:string]: string};
    sampleTumorType:{ [s:string]: string};
    sampleCancerType:{ [s:string]: string};
};

export default class MutationInformationContainer extends React.Component<IMutationInformationContainerProps, {}>
{
    // a row in the table may represent more than one mutation...
    private mergedMutations:Array<Array<Mutation>>;

    constructor(props:IMutationInformationContainerProps) {
        super(props);
        this.mergedMutations = this.mergeMutations(this.props.mutations);
    }

    public render() {
        let columns:IColumnDefMap = {
            sampleId: {
                name: "Sample Id", // name does not matter when the column is "excluded"
                visible: "excluded"
            },
            proteinChange: {
                name: "Protein Change",
                formatter: ProteinChangeColumnFormatter.renderFunction
            },
            tumors: {
                name: "Tumors",
                priority: 0.50,
                formatter: TumorColumnFormatter.renderFunction,
                sortable: TumorColumnFormatter.sortFunction,
                filterable: false,
                columnProps: {
                    sampleOrder: this.props.sampleOrder,
                    sampleColors: this.props.sampleColors,
                    sampleLabels: this.props.sampleLabels,
                    sampleTumorType: this.props.sampleTumorType,
                    sampleCancerType: this.props.sampleCancerType
                }
            },
            chromosome: {
                name: "Chr"
            },
            startPos: {
                name: "Start"
            },
            endPos: {
                name: "End"
            },
            mutationStatus: {
                name: "Status",
                visible: "excluded"
            },
            validationStatus: {
                name: "Validation"
            },
            mutationType: {
                name: "Type"
            },
            annotation: {
                name: "Annotation",
                priority: 3.50,
                sortable: true
            },
            copyNumber: {
                name: "Copy #",
                priority: 18.10,
                sortable: true
            },
            mRnaExp: {
                name: "mRNA Expr.",
                priority: 18.20,
                sortable: true
            },
            cohort: {
                name: "Cohort",
                priority: 18.30,
                sortable: true
            },
            cosmic: {
                name: "COSMIC",
                priority: 18.40,
                sortable: true
            },
            tumorAlleleFreq: {
                name: "Allele Freq",
                formatter: AlleleFreqColumnFormatter.renderFunction,
                sortable: AlleleFreqColumnFormatter.sortFunction,
                filterable: false,
                columnProps: {
                    sampleOrder: this.props.sampleOrder,
                    sampleColors: this.props.sampleColors,
                    sampleLabels: this.props.sampleLabels
                }
            },
            normalAlleleFreq : {
                name: "Allele Freq (N)"
            },
            normalRefCount: {
                name: "Ref Reads (N)",
                formatter: AlleleCountColumnFormatter.renderFunction,
                columnProps: {
                    dataField: "normalRefCount",
                    sampleOrder: this.props.sampleOrder
                }
            },
            normalAltCount: {
                name: "Variant Reads (N)",
                formatter: AlleleCountColumnFormatter.renderFunction,
                columnProps: {
                    dataField: "normalAltCount",
                    sampleOrder: this.props.sampleOrder
                }
            },
            tumorRefCount: {
                name: "Ref Reads",
                formatter: AlleleCountColumnFormatter.renderFunction,
                columnProps: {
                    dataField: "tumorRefCount",
                    sampleOrder: this.props.sampleOrder
                }
            },
            tumorAltCount: {
                name: "Variant Reads",
                formatter: AlleleCountColumnFormatter.renderFunction,
                columnProps: {
                    dataField: "tumorAltCount",
                    sampleOrder: this.props.sampleOrder
                }
            },
        };

        return (
            <div>
                <MutationTable rawData={this.mergedMutations} columns={columns} title="Mutations of Interest"/>
            </div>
        );
    }

    private mergeMutations(data:Array<Mutation>):Array<Array<Mutation>> {
        let idToMutations:{[key:string]: Array<Mutation>} = {};
        let mutationId:string;

        for (let mutation of data) {
            mutationId = this.getMutationId(mutation);
            idToMutations[mutationId] = idToMutations[mutationId] || [];
            idToMutations[mutationId].push(mutation);
        }

        return Object.keys(idToMutations).map(id => idToMutations[id]);
    }

    private getMutationId(m:Mutation):string {
        return [m.gene.chromosome, m.startPosition, m.endPosition, m.referenceAllele, m.variantAllele].join("_");
    }
}